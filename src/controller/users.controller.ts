import {
    Body,
    Controller, DefaultValuePipe,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Query, Req, Res,
    UseFilters
} from "@nestjs/common";
import {USERS_PATH} from "../constant/app.constant";
import {User} from "../model/user";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository, SelectQueryBuilder} from "typeorm";

@Controller(USERS_PATH)
export class UsersController {

    private orderByDefault: string = 'name asc';

    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {
    }

    @Post()
    create(@Body() user: User) {
        return this.usersRepository.create(user);
    }

    @Get()
    async findAll(@Query("startRow", new DefaultValuePipe(0)) startRow: number,
                  @Query("pageSize", new DefaultValuePipe(10)) pageSize: number,
                  @Query("orderBy") orderBy: String,
                  @Query() query,
                  @Req() req,
                  @Res() res) {
        if (!orderBy) orderBy = this.orderByDefault;
        const qb: SelectQueryBuilder<User> = this.usersRepository
            .createQueryBuilder()
            .skip(startRow)
            .take(pageSize);
        if (query['like.name']) {
            qb
                .andWhere('name like :name')
                .setParameter('name', '%' + query['like.name'] + '%');
        }
        if (query['like.surname']) {
            qb
                .andWhere('surname like :surname')
                .setParameter('surname', '%' + query['like.surname'] + '%');
        }
        const result = await qb.orderBy('name', "ASC").getManyAndCount();
        return res.set("Access-Control-Expose-Headers", "startRow, pageSize, listSize")
            .set("startRow", '' + startRow)
            .set("pageSize", '' + pageSize)
            .set("listSize", '' + result[1])
            .json(result[0]);
        // return this.usersRepository.findAndCount({skip: startRow, take: pageSize})
        //     .then(
        //         (result) => {
        //             return res.set("Access-Control-Expose-Headers", "startRow, pageSize, listSize")
        //                 .set("startRow", '' + startRow)
        //                 .set("pageSize", '' + pageSize)
        //                 .set("listSize", '' + result[1])
        //                 .json(result[0]);
        //         }
        //     );
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersRepository.findOne(+id)
            .then(user => {
                if (!user) {
                    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
                }
                return user;
            }).catch(ex => {
                throw new HttpException(ex.message, ex.status);
            });
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: User) {
        return this.usersRepository.update(+id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersRepository.delete(+id);
    }
}
