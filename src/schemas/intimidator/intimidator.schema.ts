import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type IntimidatorDocument = IntimidatorDB & Document

@Schema({ timestamps: true })
export class IntimidatorDB {
	@Prop({ unique: true, index: true })
	email: string

	@Prop()
	password: string

	@Prop()
	firstName: string

	@Prop()
	lastName: string

	@Prop()
	firstTimeScare: string

	@Prop({
		default: () => Math.floor(Math.random() * 5) + 1,
	})
	tentaclesNumber: number
	@Prop({
		default: () => Math.floor(Math.random() * 5) + 1,
	})
	level: number

	@Prop()
	experience: number

	@Prop()
	refreshToken: string
}

export const IntimidatorSchema = SchemaFactory.createForClass(IntimidatorDB)
