import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersResolver} from "./users.resolver";
import {UsersService} from "./users.service";
import {User} from '../entities/user.entity';
import {Article} from "../entities/article.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, Article])],
    providers: [ UsersService, UsersResolver],
    exports: [UsersResolver, UsersService, TypeOrmModule],
})
export class UsersModule {}
