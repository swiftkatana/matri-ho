import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { DepDoorDB, DepDoorSchema } from 'schemas/depDoor/depDoor.schema'
import { DoorDB, DoorSchema } from 'schemas/doors/door.schema'
import { ActionsController } from './actions.controller'
import { ActionsService } from './actions.service'

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: DoorDB.name, schema: DoorSchema },
			{ name: DepDoorDB.name, schema: DepDoorSchema },
		]),
	],
	controllers: [ActionsController],
	providers: [ActionsService],
})
export class ActionsModule {}
