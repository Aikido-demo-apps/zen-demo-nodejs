import {
  Injectable,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './types';
import { User } from 'src/users/user.model';
import { TenantsService } from 'src/tenants/tenants.service';
import { Tenant } from 'src/tenants/tenant.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tenantsService: TenantsService,
  ) {}

  async getUserInfo(id: any) {
    return this.usersService.findOneById(id);
  }

  async getFirstTenant(userId: number): Promise<number> {
    const findAllTenants =
      await this.tenantsService.findAllTenantsFromUser(userId);
    let tenantId;

    if (findAllTenants.length > 0) {
      tenantId = findAllTenants[0].id;
    }

    return tenantId;
  }

  async registerUser(
    email_address: string,
    password: string,
  ): Promise<{
    access_token: string;
    user: User;
    tenant: Tenant;
    isNewTenant: boolean;
  }> {
    const username = email_address.split('@')[0];
    const newUser = await this.usersService.create(
      email_address,
      username,
      password,
    );

    const newTenant = await this.tenantsService.create(
      username + "'s Tenant",
      'free',
      true,
      true,
      newUser.id,
    );

    const payload: JwtPayload = {
      id: newUser.id,
      email_address: newUser.email_address,
      username: newUser.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: newUser,
      tenant: newTenant,
      isNewTenant: true,
    };
  }

  async authenticateUser(
    email_address: string,
    password: string,
  ): Promise<{
    access_token: string;
    user: User;
    tenant: Tenant;
    isNewTenant: boolean;
  }> {
    const user = await this.usersService.findOneByEmail(email_address);

    if (user) {
      if (user?.password !== password) {
        Logger.log(user?.password);
        Logger.log(password);
        throw new UnauthorizedException();
      }

      const tenant = await this.tenantsService.findOneByUserId(user.id);
      const payload: JwtPayload = {
        id: user.id,
        email_address: user.email_address,
        username: user.username,
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: user,
        tenant: tenant,
        isNewTenant: false,
      };
    }

    throw new BadRequestException('Unable to find user');
  }
}
