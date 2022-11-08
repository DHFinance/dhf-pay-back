import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from 'nestjs-config';
import * as path from 'path';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

const dotEnvPath = path.resolve(__dirname, '..', '.env');

const user = {
  name: '1',
  lastName: '1',
  email: 'mail@gmail.com',
  // token:"$2b$07$PUx7RK/NjXwo7i9xpYT2vejPjU3A4hxCCvYYkDbZ/fcfgyFnCw9f.",
  role: 'customer',
  // id: 60,
  password: '5ZlEqFyVD4XMnxJsSFZf2Yra1k3m44o1E59v',
  company: 'mail.ru',
  blocked: false,
  loginAttempts: 0,
  timeBlockLogin: null,
};

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
          useFactory: () => {
            return {
              type: 'sqlite',
              database: ':memory:',
              dropSchema: true,
              synchronize: true,
              logging: false,
              entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
              keepConnectionAlive: true,
            };
          },
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([User]),
        MailerModule,
      ],
      providers: [
        UserService,
        {
          provide: MailerService,
          useValue: {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            get: jest.fn(async () => {}),
            // really it can be anything, but the closer to your actual logic the better
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    mailerService = module.get<MailerService>(MailerService);

    mailerService.sendMail = jest.fn();
  });

  it('should created user', async () => {
    const createdUser = await service.create({ ...user });
    expect(createdUser).toEqual(true);
  });

  it('should get error the same users', async () => {
    await service.create({ ...user });
    const foundedUser = await service.findByEmail(user.email);
    await service.verifyUser(foundedUser.email, foundedUser.emailVerification);
    try {
      await service.create({ ...user });

      // should not be fired
      expect(1).toEqual(2);
    } catch (e) {
      expect(e).toHaveProperty('message', 'email');
    }
  });

  it('should get error at verifying user', () => {
    expect(
      async () => await service.verifyUser(user.email, 5454),
    ).rejects.toThrow();
  });
  //
  it('should changed block', async () => {
    const foundedUser = await service.findByEmail(user.email);
    const change = await service.changeBlockUser(foundedUser.id, true);

    expect(change).toHaveProperty('blocked', true);

    await service.changeBlockUser(foundedUser.id, false);
  });

  it('find user by email', async () => {
    const foundedUser = await service.findByEmail(user.email);

    expect(foundedUser).toHaveProperty('email', 'mail@gmail.com');
  });

  afterAll(async () => {
    const foundedUser = await service.findByEmail(user.email);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    await User.remove({ ...foundedUser });
  });
});
