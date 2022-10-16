import {Module} from '@nestjs/common';
import {ArticlesResolver} from "./articles.resolver";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ArticlesService} from "./articles.service";
import {Article} from '../entities/article.entity';
import {User} from "../entities/user.entity";
import {UsersService} from "../users/users.service";

@Module({
    imports: [TypeOrmModule.forFeature([Article, User])],
    providers: [ArticlesService, ArticlesResolver, UsersService],
    exports: [ArticlesResolver, ArticlesService, TypeOrmModule],
})
export class ArticlesModule {}
