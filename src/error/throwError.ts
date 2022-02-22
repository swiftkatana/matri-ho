import { HttpException, HttpStatus } from '@nestjs/common'
export interface IThrowError {
	status?: HttpStatus
	error: string
	field: string
}
export const throwError = ({ status, error, field }: IThrowError) => {
	throw new HttpException(
		{
			status: status || HttpStatus.BAD_REQUEST,
			error: error,
			field: field,
		},
		HttpStatus.BAD_REQUEST
	)
}
