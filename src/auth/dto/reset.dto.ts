export class ResetEmailDto {
  email: string;
}

export class ResetCodeDto {
  code: string;
}

export class ChangePasswordDto {
  password: string;
  user: any;
}