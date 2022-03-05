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
}
