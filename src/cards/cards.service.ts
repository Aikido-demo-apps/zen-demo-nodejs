import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cards } from './cards.model';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CardsService {
  constructor(
    @InjectModel(Cards)
    private readonly cardsModel: typeof Cards,
    private authService: AuthService,
  ) {}

  async create(cardData: any): Promise<Cards> {
    return this.cardsModel.create(cardData);
  }

  async findAll(): Promise<Cards[]> {
    return this.cardsModel.findAll();
  }

  async findOne(userId: number, id: string): Promise<Cards> {
    const tenantId = this.authService.getFirstTenant(userId);
    // vulnerable
    const card = await this.cardsModel.findByPk(id);
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    return card;
  }

  async update(userId: number, id: string, updateData: any): Promise<Cards> {
    const tenantId = await this.authService.getFirstTenant(userId);
    // vulnerable
    const card = await this.cardsModel.findByPk(id);
    return card.update(updateData);
  }

  async remove(userId: number, id: string): Promise<void> {
    const tenantId = await this.authService.getFirstTenant(userId);
    // not vulnerable
    const card = await this.findOne(tenantId, id);
    await card.destroy();
  }
}
