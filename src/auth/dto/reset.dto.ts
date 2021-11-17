export class ResetEmailDto {
  email: string;
}

export class ResetCodeDto {
  email: string;
  code: string;
}

export class ChangePasswordDto {
  password: string;
  email: string;
}