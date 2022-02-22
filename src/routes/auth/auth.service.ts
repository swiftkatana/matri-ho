import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

import * as crypto from 'crypto'
import { JwtService } from '@nestjs/jwt'
import { IntimidatorService } from '../intimidator/intimidator.service'
import { compare } from 'bcrypt'
import { ISignInParameters } from 'interface/intimidator/intimidator-more.interface'
import { IntimidatorDocument } from 'schemas/intimidator/intimidator.schema'

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private intimidatorService: IntimidatorService
	) {}

	public async validateUser(
		userData: ISignInParameters
	): Promise<IntimidatorDocument> {
		const { email, password } = userData
		const user = await this.intimidatorService.findOneByEmail(email, false)
		if (!user)
			throw new HttpException(
				{
					status: HttpStatus.BAD_REQUEST,
					error: 'User  was not found',
					field: 'email',
				},
				HttpStatus.BAD_REQUEST
			)
		const match = await compare(password, user.password)
		if (match) return user
		else {
			throw new HttpException(
				{
					status: HttpStatus.BAD_REQUEST,
					error: 'Wrong password, please try again',
					field: 'password',
				},
				HttpStatus.BAD_REQUEST
			)
		}
	}

	public getRefreshToken(): string {
		return crypto
			.randomBytes(64)
			.toString('base64')
			.replace(/\//g, '_')
			.replace(/\+/g, '-')
	}

	public async createToken(user: IntimidatorDocument) {
		const accessToken = await this.jwtService.signAsync({ _id: user._id })
		const refreshToken = this.getRefreshToken()
		return { refreshToken, accessToken }
	}
}
