import { Test, TestingModule } from '@nestjs/testing';
import {ConfigModule, ConfigService} from "nestjs-config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {MailerModule, MailerService} from "@nest-modules/mailer";
import * as path from "path";
import {StoresService} from "./stores.service";
import {Stores} from "./entities/stores.entity";
import {UserService} from "../user/user.service";
import {User} from "../user/entities/user.entity";

const dotEnvPath = path.resolve(__dirname, '..', '.env');

const store = {
    name: "Store test",
    description: "Good store",
    url: "https://lms.sfedu.ru/my/",
    apiKey: "FL1f0BNoBB3qRQ4dKtzwNgmdT95qJniM89Ak123",
    user: {id:46},
    wallet: "01acdbbd933fd7aaedb7b1bd29c577027d86b5fafc422267a89fc386b7ebf420c9",
}

describe('StoresService', () => {
    let service: StoresService;
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
                TypeOrmModule.forFeature([Stores, User]),
                MailerModule,
            ],
            providers: [
                StoresService,
                {
                    provide: MailerService,
                    useValue: {
                        get: jest.fn(async () => {
                        }),
                        // really it can be anything, but the closer to your actual logic the better
                    }
                },
                {
                    provide: UserService,
                    useValue: {
                        get: jest.fn(async () => {
                        }),
                        // really it can be anything, but the closer to your actual logic the better
                    }
                }
            ],
        }).compile();

        service = module.get<StoresService>(StoresService);
        mailerService = module.get<MailerService>(MailerService);

    });

    it('should ',  () => {
        expect(service).toBeDefined()
    });

    it('should change blocked ', async () => {
        // @ts-ignore
        await Stores.save({...store});

        const testStore = await Stores.findOne({where: {
                name: store.name,
            }})

        const changeBlock = await service.changeBlockStore(testStore.id, true);

        expect(changeBlock).toHaveProperty("blocked", true);

    });

    it('should get error if store is blocked ',  () => {
        expect(async () => await service.validateStore(store.apiKey)).rejects.toThrow();
    });

    it('should validate store', async () => {
        const testStore = await Stores.findOne({where: {
                name: store.name,
            }})
        await service.changeBlockStore(testStore.id, false);

        const validateStore = await service.validateStore(store.apiKey);

        expect(validateStore).toHaveProperty("apiKey", store.apiKey);

        // @ts-ignore
        await Stores.remove({...testStore});
    });
});
