import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
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

  async changeBlockUser(id, blocked) {
    const store = await this.repo.findOne({
      where: {
        id
      }
    })
    try {
      const blockedUser = await this.repo.save({...store, blocked})
      return blockedUser
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  async findByToken(token) {
    return await this.repo.findOne({
      where: {
        token,
      },
    });
  }


  /**
   * @description checks the code received from the front and the code from the database. If they are the same, it sends an email about successful registration and removes the code from the user record (the user with the code in the emailVerification field cannot be authorized). Sends a user record to the front
   * @return {User}
   */
  public async verifyUser(email, code) {

    const userVerified = await this.findByEmail(email);

    if (userVerified.emailVerification == code) {
      await this.mailerService.sendMail({
        to: email,
        from: process.env.MAILER_EMAIL,
        subject: 'pay.dhfi.online',
        template: 'send-reg-message',
        context: {
          login: email,
          email: email
        },
      });
      return await this.repo.save({ ...userVerified, emailVerification: null });
    } else {
      throw new BadRequestException('code', 'Wrong code');
    }
  }

  async findByEmail(email) {
    const user = await this.repo.findOne({
      where: {
        email,
      },
    });
    if (user?.blocked === true) {
      throw new BadRequestException('email', 'User is blocked');
    }
    return user
  }

  /**
   *
   * @param user {User}
   * @description creates a user with the specified data and adds a code to the emailVerification field that sends it to the specified email.
   * @return true
   */
  public async create(user) {
    const userExisted = await this.findByEmail(user.email);
    const code = Math.floor(9999999 + Math.random() * (9999999 + 1 - 1000000));
    if (userExisted && userExisted.emailVerification === null) {
      throw new BadRequestException('email', 'User with this email exists');
    }
    if (userExisted && userExisted.emailVerification !== null) {
      await this.mailerService.sendMail({
        to: userExisted.email,
        from: process.env.MAILER_EMAIL,
        subject: 'Registration confirmation code',
        template: 'send-verification-code',
        context: {
          login: userExisted.email,
          email: userExisted.email,
          code: code,
        },
      });

      try {
        await this.repo.save({ ...userExisted, ...user, emailVerification: code});
        return true
      } catch (err) {
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      }
    } else {
       await this.mailerService.sendMail({
        to: user.email,
        from: process.env.MAILER_EMAIL,
        subject: 'Registration confirmation code',
        template: 'send-verification-code',
        context: {
          login: user.email,
          email: user.email,
          code: code,
        },
      });
      try {
        const token = randomString(36);
        await this.repo.save({ ...user, emailVerification: code, token, blocked: false });
        return true
      } catch (err) {
        console.log(err)
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      }
    }
  }

  /**
   *
   * @param email {string}
   * @description receives the mail to which it sends the generated code, which writes to restorePasswordCode
   */
  async sendCode(email) {
    const user = await this.findByEmail(email);
    if (user?.emailVerification !== null) {
      throw new BadRequestException('email', 'User is not exist');
    }
    if (!user) {
      throw new BadRequestException('email', 'User with this email does not exist');
    }
    const code = Math.floor(9999999 + Math.random() * (9999999 + 1 - 1000000));
    user.restorePasswordCode = code;
    await user.save();
    return await this.mailerService.sendMail({
      to: email,
      from: process.env.MAILER_EMAIL,
      subject: 'Password reset code',
      template: 'send-password-code',
      context: {
        login: email,
        email: email,
        code: code,
      },
    });
  }

  /**
   *
   * @param code {string}
   * @param email {string}
   * @description checks the received code with the user code with received mail from the database. If the codes match - admits to the next stage
   */
  async checkCode(code, email) {
    const user = await this.findByEmail(email)
    if (!user || user.restorePasswordCode !== +code)  {
      throw new BadRequestException('code', 'Wrong restore code');
    }
    return user
  }

  /**
   * @description searches for a user by token. If the user exists, returns his data. If blocked or does not exist - throws an error
   * @param token {string}
   * @return {User}
   */
  async reAuth(token: string) {
    const user = await this.findByToken(token)
    if (user.blocked === true) {
      throw new BadRequestException('email', 'User is blocked');
    }
    if (!user)  {
      throw new BadRequestException('token', 'User not exist');
    }
    return user
  }

  /**
   *
   * @param password {string}
   * @param email {string}
   * @description replaces the user's password with a new one
   */
  async changePassword(password, email) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new BadRequestException('email', 'User with this email does not exist');
    }
    user.restorePasswordCode = null;
    user.password = password;
    await user.save();
    return user
  }
}
