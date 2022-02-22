import {
	Injectable,
	ExecutionContext,
	UnauthorizedException,
	HttpStatus,
	HttpException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from 'decorators/public.decorator'
import { Request } from 'express'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(private reflector: Reflector) {
		super()
	}
	lastRequest: Request
	canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		])
		this.lastRequest = context.switchToHttp().getRequest()

		if (isPublic) {
			return true
		}
		return super.canActivate(context)
	}

	handleRequest(err, user, info) {
		if (err || !user) {
			if (info?.name === 'TokenExpiredError') {
				throw new HttpException(
					{
						status: HttpStatus.UNAUTHORIZED,
						error: 'Token expired',
						field: 'login',
					},
					HttpStatus.UNAUTHORIZED
				)
			}
			throw err || new UnauthorizedException()
		}
		return user
	}
}
