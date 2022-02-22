import { Request } from 'express'
import { IntimidatorDocument } from 'schemas/intimidator/intimidator.schema'
export interface IGetUserAuthInfoRequest extends Request {
	user: IntimidatorDocument // or any other type
}
