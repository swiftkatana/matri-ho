import { IsEmail } from 'class-validator'

export class SignUpUserDto {
	//TODO: add validation
	@IsEmail()
	email: string
	password: string
	firstName: string
	lastName: string
}
