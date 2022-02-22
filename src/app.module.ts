import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { AuthModule } from 'routes/auth/auth.module'
import { IntimidatorModule } from 'routes/intimidator/intimidator.module'
import { IntimidatorController } from 'routes/intimidator/intimidator.controller'
import { JwtAuthGuard } from 'guards/jwt-auth.guard'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthController } from 'routes/auth/auth.controller'
import { ActionsModule } from './routes/actions/actions.module'

@Module({
	imports: [
		MongooseModule.forRoot(
			'mongodb+srv://SwiftKatana:YBRLVntQSyxlekeZ@swiftkatana.3gw5v.mongodb.net/mat',
			{
				useNewUrlParser: true,
				useCreateIndex: true,
				useUnifiedTopology: true,
			}
		),
		ConfigModule.forRoot(),
		ThrottlerModule.forRoot({
			ttl: 60,
			limit: 10,
		}),
		IntimidatorModule,
		AuthModule,
		ActionsModule,
	],
	providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply().forRoutes(IntimidatorController, AuthController)
	}
}
