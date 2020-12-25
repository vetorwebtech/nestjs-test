import {Injectable} from '@nestjs/common';
import {User} from "../model/user";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {
        for (let i = 0; i < 10; i++) {
            const user: User = new User();
            user.name = 'fiorenzo' + i;
            user.surname = 'pizza + i';
            user.age = i*3;
            console.log(user);
            this.usersRepository.save(user);
        }
    }

    create(user: User): User {
        console.log('create user: ' + user);
        return this.usersRepository.create(user);
    }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(id: number): Promise<User> {
        console.log('find by id: ' + id);
        return this.usersRepository.findOne(+id);
    }
}
