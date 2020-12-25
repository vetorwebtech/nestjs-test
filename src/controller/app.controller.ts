import {Controller, Get, Param, Post, Req, Request, UploadedFile, UseInterceptors} from '@nestjs/common';
import {AppService} from '../service/rs/app.service';
import {User} from "../model/user";
import {UserService} from "../service/user.service";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller()
export class AppController {

    constructor(private readonly appService: AppService, private  userService: UserService) {
    }

    @Get('/hello')
    async getHello() {
        const u: User = new User();
        u.age = 12;
        u.name = 'fiorenzo';
        u.surname = 'pizza';
        this.userService.create(u);
        return 'Hello World!';
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
    uploadFile(@UploadedFile() file) {
        console.log(file);
    }

}
