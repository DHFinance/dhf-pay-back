import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { WalletOrmEntity } from '../wallets/orm-entities/wallet.entity';
import { Stores } from './entities/stores.entity';

@Injectable()
export class StoresService extends TypeOrmCrudService<any> {
  constructor(
    @InjectRepository(Stores)
    private readonly _storesRepository: Repository<Stores>,
    @InjectRepository(WalletOrmEntity)
    private readonly _walletsRepository: Repository<WalletOrmEntity>,
    private readonly userService: UserService,
  ) {
    super(_storesRepository);
  }

  async create(store) {
    const currencies = [];

    store.wallets.forEach((wallet) => currencies.push(wallet.currency));

    if ([...new Set(currencies)].length !== currencies.length) {
      throw new HttpException('wrong wallets', HttpStatus.BAD_REQUEST);
    }

    try {
      const newStore = Stores.create();
      newStore.blocked = false;
      newStore.name = store.name;
      newStore.description = store.description;
      newStore.wallets = await this._walletsRepository.save(store.wallets);
      newStore.apiKey = store.apiKey;
      newStore.url = store.url;
      newStore.user = store.user;
      return await this._storesRepository.save(newStore);
    } catch (e) {
      console.log(e);
    }
  }

  async changeBlockStore(id, status) {
    const store = await this._storesRepository.findOne({
      where: {
        id,
      },
    });
    if (!store) {
      throw new HttpException('store not found', HttpStatus.NOT_FOUND);
    }
    try {
      const blockedStore = await this._storesRepository.save({
        ...store,
        blocked: status,
      });
      return blockedStore;
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  async validateStore(apiKey) {
    const store = await this._storesRepository.findOne({
      where: {
        apiKey,
      },
    });
    if (store?.blocked === true) {
      throw new BadRequestException('store', 'Store is blocked');
    }
    if (store) {
      return store;
    }
    throw new HttpException(
      'store with this API not exist',
      HttpStatus.BAD_REQUEST,
    );
  }

  async getAllStore(token) {
    const store = await this._storesRepository.find({
      relations: ['user', 'wallets'],
    });
    const filteredStores = store.filter((store) => store.user.token === token);
    if (filteredStores.length) {
      filteredStores.forEach((store) => {
        delete store.user.token;
        delete store.user.restorePasswordCode;
        delete store.user.emailVerification;
        return store;
      });
      return filteredStores;
    }
    throw new HttpException('stores not found', HttpStatus.NOT_FOUND);
  }

  async getUserStore(id, token) {
    const store = await this._storesRepository.find({
      where: { id: id.id },
      relations: ['user', 'wallets'],
    });
    const user = await this.userService.findByToken(token);
    if (user) {
      if (user.role === 'admin') {
        return store[0];
      }
    }
    if (!store.length) {
      throw new HttpException('store not found', HttpStatus.NOT_FOUND);
    }
    if (store[0].user.token === token || store[0].apiKey === token) {
      delete store[0].user.token;
      delete store[0].user.restorePasswordCode;
      delete store[0].user.emailVerification;
      return store[0];
    }

    throw new HttpException(
      'you are not the creator of the store',
      HttpStatus.CONFLICT,
    );
  }

  async updateStore(body, id, header) {
    const store = await this._storesRepository.findOne({
      where: { id: id.id },
      relations: ['user', 'wallets'],
    });

    if (store.user.token !== header) {
      throw new HttpException(
        'You cant change this store',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userService.findByTokenSelected(header);
    if (body?.id) {
      if (body.id !== store.id) {
        throw new HttpException('you cant change ID', HttpStatus.CONFLICT);
      }
    } else {
      body = { ...body, id: +id.id };
    }
    if (body?.blocked) {
      if (body.blocked !== store.blocked) {
        throw new HttpException(
          'you cant change blocked status',
          HttpStatus.CONFLICT,
        );
      }
    }
    if (!body.user) {
      body = { ...body, user: user };
    }
    if (body.wallets) {
      const currencies = [];

      body.wallets.forEach((wallet) => currencies.push(wallet.currency));

      if ([...new Set(currencies)].length !== currencies.length) {
        throw new HttpException(
          'you cant update wallets',
          HttpStatus.BAD_REQUEST,
        );
      }

      body.wallets
        .map((wallet) => {
          if (
            store.wallets.find(
              (el) =>
                el.value === wallet.value && el.currency === wallet.currency,
            )
          ) {
            return null;
          } else {
            return wallet;
          }
        })
        .filter(Boolean);

      await this._walletsRepository.save(body.wallets);
    }

    return this._storesRepository.save(body);
  }
}
