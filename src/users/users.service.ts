import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOneById(id: number): Promise<User> {
    return this.userModel.findOne({
      where: {
        id: id,
      },
    });
  }

  async create(email_address: string, username: string) {
    return this.userModel.create({
      email_address: email_address,
      username: username,
    });
  }
  async findOneByEmail(email_address: string): Promise<User> {
    return this.userModel.findOne({
      where: {
        email_address: email_address,
      },
    });
  }
}
