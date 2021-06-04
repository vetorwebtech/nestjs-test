import {Body, Controller, Get, Param, Post, Req, Request, UploadedFile, UseInterceptors} from '@nestjs/common';
import {AppService} from '../service/app.service';
import {User} from "../model/user";
import {UserService} from "../service/user.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {MinioClientService} from "../service/minio-client.service";
import {EventEmitter2} from '@nestjs/event-emitter';
import {UploadFileEvent} from "../model/pojo/upload.file.event";

@Controller()
export class AppController {

    constructor(private readonly appService: AppService,
                private  userService: UserService,
                private minioClientService: MinioClientService,
                private eventEmitter: EventEmitter2) {
    }

    @Get('/hello')
    async getHello() {
        const u: User = new User();
        u.age = 12;
        u.name = 'fiorenzo';
        u.surname = 'pizza';
        this.userService.create(u);
        return 'Hello VETORWEB!';
    }

    @Get()
    async findAll(@Req() request: Request): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    async findOne(@Param() params): Promise<User> {
        console.log(params.id);
        return this.userService.findOne(+params.id);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file, @Body() body) {
        console.log(file);
        console.log(body);
        this.minioClientService.upload(file)
            .then(
                name => {
                    console.log('UPLOADED: ' + name);
                    return name;
                }
            ).then(name => {
                console.log('sent async: ' + JSON.stringify(name));
                const uploadFileEvent = new UploadFileEvent();
                uploadFileEvent.filename = body.filename;
                uploadFileEvent.name = name.url;
                this.eventEmitter.emitAsync('upload.file', uploadFileEvent);
            }
        );
    }

}
