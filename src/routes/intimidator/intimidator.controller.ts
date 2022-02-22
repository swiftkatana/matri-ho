import {
	Body,
	Controller,
	Get,
	Post,
	Query,
	Req,
	UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from 'guards/jwt-auth.guard'
import { IGetUserAuthInfoRequest } from 'type/MyRequest'

import { IntimidatorService } from './intimidator.service'

@Controller('api/intimidator')
@UseGuards(JwtAuthGuard)
export class IntimidatorController {}
