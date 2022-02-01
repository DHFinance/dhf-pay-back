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
  let mailerService: MailerService;

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
            // really it can be anything, but the closer to your actual logic the better
          }
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    console.log(service)
    expect(service).toBeDefined();
  });

  it('find user by email',async () => {
    const user = {
      name:"1",
      lastName:"1",
      email:"mail@gmail.com",
      token:"$2b$07$PUx7RK/NjXwo7i9xpYT2vejPjU3A4hxCCvYYkDbZ/fcfgyFnCw9f.",
      role:"customer",
      id: 60,
      password:"5ZlEqFyVD4XMnxJsSFZf2Yra1k3m44o1E59v",
      company:"mail.ru"
    };

    // @ts-ignore
    await User.save({ ...user, blocked: false });

    const foundedUser = await User.findOne({
      where: {
        email: user.email
      },
    })

    expect(foundedUser).toHaveProperty("email","mail@gmail.com");

    // @ts-ignore
    await User.remove({...foundedUser})
  });
});