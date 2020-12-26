import {Module} from '@nestjs/common';
import {AppController} from './controller/app.controller';
import {AppService} from './service/app.service';
import {UserService} from './service/user.service';
import {ScheduleModule} from "@nestjs/schedule";
import {TasksService} from "./service/timer/tasks.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {MinioModule} from "nestjs-minio-client";
import {User} from "./model/user";
import {MinioConstant} from "./constant/minio.constant";
import {PostgresqlConstant} from "./constant/postgresql.constant";
import {MinioClientService} from "./service/minio-client.service";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {UploadEventService} from "./service/events/upload.event.service";
import {UsersController} from "./controller/users.controller";
import {BoxesController} from "./controller/boxes.controller";
import {Box} from "./model/box";

@Module({
    imports: [
        EventEmitterModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: PostgresqlConstant.HOST,
            port: PostgresqlConstant.PORT,
            username: PostgresqlConstant.USERNAME,
            password: PostgresqlConstant.PASSWORD,
            database: PostgresqlConstant.DATABASE,
            autoLoadEntities: PostgresqlConstant.AUTO_UPLOAD_ENTITIES,
            synchronize: PostgresqlConstant.SYNCHRONIZE,
            logging: "all"
        }),
        MinioModule.register({
            endPoint: MinioConstant.MINIO_ENDPOINT,
            port: MinioConstant.MINIO_PORT,
            useSSL: MinioConstant.MINIO_USE_SSL,
            accessKey: MinioConstant.MINIO_ACCESSKEY,
            secretKey: MinioConstant.MINIO_SECRETKEY
        }), ScheduleModule.forRoot(),
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([Box])
    ],
    controllers: [AppController, UsersController, BoxesController],
    providers: [AppService, UserService, TasksService, MinioClientService, UploadEventService],
})
export class AppModule {
}
