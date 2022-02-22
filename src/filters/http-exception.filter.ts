import {
	InternalServerErrorException,
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
} from '@nestjs/common'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	catch(exception: InternalServerErrorException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse()
		const request = ctx.getRequest()
		const status =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR

		/**
		//  * @description Exception json response
		//  * @param message
		 */
		const responseMessage = (type, message) => {
			response.status(status).json({
				statusCode: status,
				path: request.url,
				error: type,
				message: message,
			})
		}
		// Throw an exceptions for either
		// MongoError, ValidationError, TypeError, CastError and Error
		let error = exception?.getResponse as any

		if (error?.field) response.status(status).json(error)
		else if (exception.message) {
			responseMessage('Error', exception.message)
		} else {
			responseMessage(exception.name, exception.message)
		}
	}
}
