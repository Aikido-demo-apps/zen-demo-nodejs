import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cards } from './cards.model';
import { AuthService } from 'src/auth/auth.service';
import { UpdateCardDto } from './dto/update-card.dto';

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

  async legacyCheckIfTenantHasCard(userId: number, tenant_id: string, created_by: string): Promise<boolean> {
    // This logic doesn't make sense, but ensures that we can also detect 2 different vulnerabilities in 2 different places on the SAME endpoint.
    // This will be refactored later to make it more realistic.
    let query = "SELECT * FROM cards WHERE tenant_id = '1' LIMIT 1;"
    if (tenant_id != "string") {
     query = `
      SELECT * 
      FROM cards 
      WHERE tenant_id = '${tenant_id}'
      LIMIT 1;
    `;
    }

    if (tenant_id == "string") {
      query = `
      SELECT * 
      FROM cards 
      WHERE created_by = '${created_by}'
      LIMIT 1;
    `;
    }
  
    const [card] = await this.cardsModel.sequelize.query(query, {
      model: this.cardsModel, 
      mapToModel: true, 
    });

    // Check if a card was found
    return card !== undefined;
  }

  async legacyUpdate(userId: number, id: string, updateData: UpdateCardDto): Promise<Cards> {
    const query = `
      SELECT * 
      FROM cards 
      WHERE id = '${id}' AND 
      tenant_id = '${updateData.tenant_id}'
      LIMIT 1;
    `;
  
    const [card] = await this.cardsModel.sequelize.query(query, {
      model: this.cardsModel, 
      mapToModel: true, 
    });
  
    return card.update(updateData);
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
