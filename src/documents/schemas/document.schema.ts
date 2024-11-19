import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DocumentDocument = HydratedDocument<Document>;

@Schema()
export class Document {
  @Prop()
  name: string;

  @Prop()
  content: string;

  @Prop()
  tenantId: string;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);