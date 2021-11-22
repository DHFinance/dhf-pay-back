import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from './interfaces/user.interface';
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { MailerService } from '@nest-modules/mailer';

function randomString(len) {
  const charSet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < len; i++) {
    const randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  constructor(@InjectRepository(User) repo,
              private mailerService: MailerService
  ) {
    super(repo);
  }

  async findByToken(token) {
    return await this.repo.findOne({
      where: {
        token,
      },
    });
  }

  async findByEmail(email) {
    return await this.repo.findOne({
      where: {
        email,
      },
    });
  }

  async findByCode(restorePasswordCode) {
    return await this.repo.findOne({
      where: {
        restorePasswordCode,
      },
    });
  }

  async findAll() {
    return await this.repo.find();
  }

  public async create(user): Promise<IUser> {
    try {
      const token = randomString(36);
      return await this.repo.save({ ...user, token });
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async sendCode(email) {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new HttpException(
        'No such user with this email',
        HttpStatus.BAD_REQUEST,
      );
    }
    const code = Math.floor(9999999 + Math.random() * (9999999 + 1 - 1000000));
    user.restorePasswordCode = code;
    await user.save();
    return await this.mailerService.sendMail({
      to: email,
      from: 'service-info@smartigy.ru',
      subject: 'Код для сброса пароля',
      template: 'send-password-code',
      context: {
        login: email,
        email: email,
        code: code,
      },
    });
  }

  async checkCode(code, email) {
    const user = await this.findByEmail(email)
    if (!user || user.restorePasswordCode !== +code)  {
      throw new HttpException('Wrong restore code', HttpStatus.BAD_REQUEST);
    }
    return user
  }

  async changePassword(password, email) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new HttpException('Wrong restore code', HttpStatus.BAD_REQUEST);
    }
    user.restorePasswordCode = null;
    user.password = password;
    await user.save();
    return user
  }
}
