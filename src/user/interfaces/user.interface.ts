export interface IUser {
  readonly id: number;
  name: string;
  lastName: string;
  email: string;
  company: string;
  password: string;
  token: string;
  blocked: boolean;
  role: 'admin' | 'customer';
}
