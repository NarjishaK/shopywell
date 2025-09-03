// types/user.ts
import { Document } from 'mongoose';

export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  addresses?: IAddress[];
  phone?: string;
  tokens?: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

export interface ICreateUserRequest {
  name: string;
  email: string;
  password: string;
  addresses?: IAddress[];
  phone?: string;
}