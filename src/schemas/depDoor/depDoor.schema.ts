import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type DepDoorDocument = DepDoorDB & Document

@Schema({ timestamps: true })
export class DepDoorDB {
	@Prop()
	intimidatorId: string
	@Prop()
	doorId: string
}

export const DepDoorSchema = SchemaFactory.createForClass(DepDoorDB)
