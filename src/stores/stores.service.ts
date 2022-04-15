import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Stores } from "./entities/stores.entity";

@Injectable()
export class StoresService extends TypeOrmCrudService<Stores> {
  constructor(@InjectRepository(Stores) repo
  ) {
    super(repo);
  }

  async changeBlockStore(id, blocked) {
    const store = await this.repo.findOne({
      where: {
        id
      }
    })
    try {
      const blockedStore = await this.repo.save({...store, blocked})
      return blockedStore
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  async validateStore(apiKey) {
    const store = await this.repo.findOne({
      where: {
        apiKey
      }
    })
    if (store?.blocked === true) {
      throw new BadRequestException('store', 'Store is blocked');
    }
    if (store) {
      return store
    }
    throw new HttpException('store with this API not exist', HttpStatus.BAD_REQUEST);
  }

  async getAllStore(token) {
    const store = await this.repo.find({
      relations: ['user']
    })
    const filteredStores = store.filter((store) => store.user.token === token)
    if (filteredStores.length) {
      filteredStores.forEach((store) => {
        delete store.user.token
        delete store.user.restorePasswordCode
        delete store.user.emailVerification
        return store
      })
      return filteredStores
    }
    throw new HttpException('stores not found', HttpStatus.NOT_FOUND);
  }

  async getUserStores(id, token) {
    const store = await this.repo.find({
      where: {id: id.id},
      relations: ['user']
    })
    if (!store.length) {
      throw new HttpException('store not found', HttpStatus.NOT_FOUND)
    }
    if (store[0].user.token === token || store[0].apiKey === token) {
      delete store[0].user.token
      delete store[0].user.restorePasswordCode
      delete store[0].user.emailVerification
      return store[0];
    }

    throw new HttpException('you are not the creator of the store', HttpStatus.CONFLICT);
  }

  async updateStore(body, id, header) {
    const store = await this.repo.find({
      where: {id: id.id},
      relations: ['user']
    })
    if (store[0].user.token === header) {
      return this.repo.save(body);
    }
    return false
  }
}
