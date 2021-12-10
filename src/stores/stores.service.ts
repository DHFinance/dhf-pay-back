import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Stores } from "./entities/stores.entity";

@Injectable()
export class StoresService extends TypeOrmCrudService<Stores> {
  constructor(@InjectRepository(Stores) repo
  ) {
    super(repo);
  }
}
