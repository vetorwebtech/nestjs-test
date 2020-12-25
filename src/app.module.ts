import {Module} from '@nestjs/common';
import {AppController} from './controller/app.controller';
import {AppService} from './service/rs/app.service';
import {UserService} from './service/user.service';
import {ScheduleModule} from "@nestjs/schedule";
import {TasksService} from "./service/timer/tasks.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {MinioModule} from "nestjs-minio-client";
import {User} from "./model/user";

@Module({
    imports: [TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'flower1',
        password: 'flower1',
        database: 'flower1',
        autoLoadEntities: true,
        synchronize: true,
    }), MinioModule.register({
        endPoint: '127.0.0.1',
        port: 9000,
        useSSL: false,
        accessKey: 'minio',
        secretKey: 'minio123'
    }), ScheduleModule.forRoot(),
        TypeOrmModule.forFeature([User])],
    controllers: [AppController],
    providers: [AppService, UserService, TasksService],
})
export class AppModule {
}
