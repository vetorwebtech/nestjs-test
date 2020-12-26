import {Injectable, Logger} from '@nestjs/common';
import {User} from "../model/user";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class UserService {

    private readonly logger = new Logger(UserService.name);


    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {
        // for (let i = 0; i < 10; i++) {
        //     const user: User = new User();
        //     user.name = 'fiorenzo' + i;
        //     user.surname = 'pizza + i';
        //     user.age = i * 3;
        //     this.logger.log(user);
        //     this.usersRepository.save(user);
        // }
    }

    create(user: User): User {
        this.logger.log('create user: ' + user);
        return this.usersRepository.create(user);
    }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(id: number): Promise<User> {
        this.logger.log('find by id: ' + id);
        return this.usersRepository.findOne(+id);
    }
}
