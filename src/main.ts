import { NestFactory } from '@nestjs/core'
import * as helmet from 'helmet'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { AllExceptionsFilter } from 'filters/http-exception.filter'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
async function bootstrap() {
	const logger: Logger = new Logger('Start server')
	const app = await NestFactory.create(AppModule)
	app.useGlobalFilters(new AllExceptionsFilter())
	app.use(helmet())
	app.use(cookieParser())
	const config = new DocumentBuilder()
		.setTitle('Welcome to Monsters Inc. R&D developer')
		.setDescription(
			'As a non-stop evolving corporation, we decided to move forward to cutting-edge technologies and develop a brand-new workday management API that oversees day-cycle management for our intimidation crew and will be adopted by the power gathering department'
		)
		.setVersion('1.0')
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api', app, document)
	const PORT = process.env.PORT || 1029
	await app.listen(PORT, () => {
		console.clear()
		logger.log(`server listening on ${PORT}`)
	})
}
bootstrap()
