import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { DepDoorDB, DepDoorDocument } from 'schemas/depDoor/depDoor.schema'
import { DoorDB, DoorDocument } from 'schemas/doors/door.schema'
import { IntimidatorDocument } from 'schemas/intimidator/intimidator.schema'

@Injectable()
export class ActionsService {
	constructor(
		@InjectModel(DoorDB.name)
		private DoorModule: Model<DoorDocument>,
		@InjectModel(DepDoorDB.name)
		private DepDoorModule: Model<DepDoorDocument>
	) {}

	public async openDoor(
		doorId: string,
		intimidator: IntimidatorDocument
	): Promise<{ door: DoorDocument; didLevelUp: boolean }> {
		const door = await this.DoorModule.findById(doorId)
		let didLevelUp = false
		const today = new Date().toISOString().split('T')[0]
		if (door.lastScared === today) {
			throw new Error('door already open today')
		}
		if (!intimidator.firstTimeScare) intimidator.firstTimeScare = today
		door.lastScared = today

		await this.DepDoorModule.create({
			intimidatorId: intimidator._id,
			doorId: door._id,
		})
		// check if the intimidator level up
		//  if is experience is pass or equal to (level * 10) +100
		const experienceForLevelUp = intimidator.level * 10 + 100
		if (intimidator.experience >= experienceForLevelUp) {
			// level up
			intimidator.level += 1
			// reset experience
			intimidator.experience = intimidator.experience - experienceForLevelUp
			didLevelUp = true
		}
		await intimidator.save()
		await door.save()

		return { door, didLevelUp }
	}

	public async getAvailabDoors(): Promise<DoorDocument[]> {
		// get all doors the the propertie lastScared is not today in format YYYY-MM-DD
		return await this.DoorModule.find({
			lastScared: { $ne: new Date().toISOString().split('T')[0] },
		})
	}
}
