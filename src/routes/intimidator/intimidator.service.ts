import { Injectable, HttpStatus, HttpException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
	IntimidatorDB,
	IntimidatorDocument,
} from 'schemas/intimidator/intimidator.schema'
import { ICreateUser } from 'interface/intimidator/intimidator-more.interface'
import { hash } from 'bcrypt'
@Injectable()
export class IntimidatorService {
	constructor(
		@InjectModel(IntimidatorDB.name)
		private IntimidatorModule: Model<IntimidatorDocument>
	) {}
	private filterUserObject = (show: boolean) =>
		show
			? {
					password: 0,
					token: 0,
					email: 0,
			  }
			: {}

	public async serachUserQuery(
		query: string,
		userId: string
	): Promise<IntimidatorDocument[]> {
		const filterSeachQuery = [
			{ email: { $regex: `${query}`, $options: 'ig' } },
			{ firstName: { $regex: `${query}`, $options: 'gi' } },
			{ lastName: { $regex: `${query}`, $options: 'gi' } },
		]

		return await this.IntimidatorModule.find({
			$or: filterSeachQuery,
			_id: { $ne: userId },
		})
	}

	public async createIntimidator(
		userDetails: ICreateUser
	): Promise<IntimidatorDocument> {
		const { firstName, lastName, password, email } = userDetails

		if (
			password.length < 8 ||
			!/\d/.test(password) ||
			!/[A-Z]/.test(password) ||
			!/[^a-zA-Z0-9]/.test(password)
		)
			throw new HttpException(
				'Password must be at least 8 characters long, contain a number and a special character',
				HttpStatus.BAD_REQUEST
			)

		const hashedPassword = await hash(password, 10)
		const newIntimidator = await new this.IntimidatorModule({
			email,
			password: hashedPassword,
			refreshToken: Date.now().toLocaleString(),
			firstName,
			lastName,
		})
		await newIntimidator.save()

		return newIntimidator
	}

	async findOneById(
		_id: string,
		getFilterUser: boolean
	): Promise<IntimidatorDocument | any> {
		const user = await this.IntimidatorModule.findById(
			_id,
			this.filterUserObject(getFilterUser)
		)
		if (!user)
			throw new HttpException(
				{
					status: HttpStatus.BAD_REQUEST,
					error: 'user not found',
					field: 'user',
				},
				HttpStatus.BAD_REQUEST
			)

		return user
	}

	async findOneByEmail(
		email: string,
		getFilterUser: boolean
	): Promise<IntimidatorDocument & any> {
		const user = await this.IntimidatorModule.findOne(
			{ email: email },
			this.filterUserObject(getFilterUser)
		)

		return user
	}

	public async findOneByToken(
		token: string,
		getFilterUser: boolean
	): Promise<IntimidatorDocument | any> {
		const user = await this.IntimidatorModule.findOne(
			{ refreshToken: token },
			this.filterUserObject(getFilterUser)
		)

		if (!user)
			throw new HttpException(
				{
					status: HttpStatus.BAD_REQUEST,
					error: 'user not found',
					field: 'user',
				},
				HttpStatus.BAD_REQUEST
			)

		return user
	}
}
