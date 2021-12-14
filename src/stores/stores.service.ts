import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Stores } from "./entities/stores.entity";

@Injectable()
export class StoresService extends TypeOrmCrudService<Stores> {
  constructor(@InjectRepository(Stores) repo
  ) {
    super(repo);
  }

  async findStore(apiKey) {
    const store = await this.repo.findOne({
      where: {
        apiKey
      }
    })
    if (store) {
      return store
    }
    throw new HttpException('store with this API not exist', HttpStatus.BAD_REQUEST);
  }
}
