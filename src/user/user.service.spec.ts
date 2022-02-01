import {Test, TestingModule} from '@nestjs/testing';
import {UserService} from './user.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {MailerModule, MailerService} from "@nest-modules/mailer";
import {ConfigModule, ConfigService} from "nestjs-config";
import * as path from "path";

const dotEnvPath = path.resolve(__dirname, '..', '.env');

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.load(
            path.resolve(__dirname, 'config', '**!(*.d).config.{ts,js}'),
            {
              path: dotEnvPath,
            },
        ), //ci
        TypeOrmModule.forRootAsync({
          useFactory: (config: ConfigService) => {
            return {
              ...config.get('database.config'),
              entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
            };
          },
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([User]),
        MailerModule
      ],
      providers: [
        UserService,
        {
          provide: MailerService,
          useValue: {
            get: jest.fn(() => {
            }),
            findByEmail: jest.fn().mockImplementation(()=> Promise.resolve())
            // really it can be anything, but the closer to your actual logic the better
          }
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    console.log(service)
    expect(service).toBeDefined();
  });

  it('find user by email',async () => {
    const user = {
      email:"ermachenkovvova@gmail.com",
    };
    expect(await User.findOne({
      where: {
        email: "ermachenkovvova@gmail.com",
      },
    })).toBe({id:expect.any(Number), ...user});
  });
});