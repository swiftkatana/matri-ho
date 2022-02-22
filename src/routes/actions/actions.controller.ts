import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'guards/jwt-auth.guard'
import { ActionsService } from './actions.service'
import { IGetUserAuthInfoRequest } from 'type/MyRequest'
import { OpenDoorDto } from 'dtos/door'

@Controller('api/actions')
export class ActionsController {
	constructor(private actionService: ActionsService) {}

	@Put('open-door')
	@UseGuards(JwtAuthGuard)
	async openDoor(
		@Body() openDoor: OpenDoorDto,
		@Req() request: IGetUserAuthInfoRequest
	) {
		return {
			status: 'success',
			data: await this.actionService.openDoor(openDoor.doorId, request.user),
		}
	}

	@Get('door')
	@UseGuards(JwtAuthGuard)
	async getDoors() {
		return { status: 'success', data: await this.actionService.getAvailabDoors() }
	}
}
