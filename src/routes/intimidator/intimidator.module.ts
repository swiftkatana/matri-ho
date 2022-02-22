import { Module } from '@nestjs/common'
import {
	IntimidatorDB,
	IntimidatorSchema,
} from 'schemas/intimidator/intimidator.schema'
import { IntimidatorController } from './intimidator.controller'
import { IntimidatorService } from './intimidator.service'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: IntimidatorDB.name, schema: IntimidatorSchema },
		]),
	],
	controllers: [IntimidatorController],
	providers: [IntimidatorService],
	exports: [IntimidatorService],
})
export class IntimidatorModule {}
