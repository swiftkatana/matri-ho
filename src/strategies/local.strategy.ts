import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from 'routes/auth/auth.service'
import { Request } from 'express'
import { IntimidatorDocument } from 'schemas/intimidator/intimidator.schema'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({ usernameField: 'email', passReqToCallback: true })
	}
	async validate(
		request: Request,
		email: string,
		password: string
	): Promise<IntimidatorDocument> {
		const user = await this.authService.validateUser({
			email,
			password,
		})
		if (!user) {
			throw new UnauthorizedException()
		}
		return user
	}
}
