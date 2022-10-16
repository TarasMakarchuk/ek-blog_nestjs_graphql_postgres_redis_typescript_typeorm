import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../entities/user.entity";
import {CreateUserInput} from "./dto/create-user.input";
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import {PaginationUserInput} from "./dto/pagination.article.input";
import {UpdateUserDto} from "./dto/update-user.input";
import {UserNotFoundException} from "../common/exceptions/userNotFoundException";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    };

    async findOneByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({email});
    };

    async findOneById(id: number): Promise<User> {
        const user = await this.userRepository.findOne(id);
        if (!user) {
            throw new UserNotFoundException();
        }
        return user;
    };

    async create(data: CreateUserInput): Promise<User> {
        return await this.userRepository.save(data);
    };

    async updateUser(data: UpdateUserDto): Promise<User> {
        return await this.userRepository.save(data);
    };

    paginate(data: PaginationUserInput): Promise<Pagination<User>> {
        const queryBuilder = this.userRepository.createQueryBuilder('queryBuilder');
        queryBuilder.orderBy(`queryBuilder.${data.sortField}`, data.sortOrder);
        const {limit, page} = data;
        const options: IPaginationOptions = {limit, page};
        return paginate<User>(queryBuilder, options);
    };

    async delete(id: number): Promise<boolean> {
        const user = await this.userRepository.findOne(id);
        if (!user) {
            throw new UserNotFoundException(`User with id ${id} is not exists`);
        }
        return !!await this.userRepository.delete(id);
    };
}
