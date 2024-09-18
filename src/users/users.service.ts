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

  async legacyFindUserById(id: string): Promise<User> {
    const query = `
      SELECT * 
      FROM users 
      WHERE id = ${id}
      LIMIT 1;
    `;
  
    const [user] = await this.userModel.sequelize.query(query, {
      model: this.userModel, 
      mapToModel: true, 
    });
  
    return user;
  }

  async findOneById(id: number): Promise<User> {
    return this.userModel.findOne({
      where: {
        id: id,
      },
    });
  }

  async create(email_address: string, username: string, password: string) {
    return this.userModel.create({
      email_address: email_address,
      username: username,
      password: password,
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
