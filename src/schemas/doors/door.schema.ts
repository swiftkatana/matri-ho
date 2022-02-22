import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type DoorDocument = DoorDB & Document

@Schema({ timestamps: true })
export class DoorDB {
	@Prop()
	name: string
	@Prop()
	description: string
	@Prop()
	lastScared: string
	@Prop()
	experience: Number
}

export const DoorSchema = SchemaFactory.createForClass(DoorDB)
