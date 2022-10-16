import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {ArticlesService} from "./articles.service";
import {CreateArticleInput} from "./dto/create-article.input";
import {Article} from './dto/article.entity';
import {UpdateArticleInput} from "./dto/update-article.input";
import {UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/guards/jwt-auth-guard";
import {CtxUser} from '../users/decorators/ctx-user.decorator';
import {User} from '../entities/user.entity';
import {Role} from "../users/role/role.enum";
import {RolesGuard} from "../users/guards/roles.guard";
import {Roles} from '../users/decorators/roles.decorator';
import {Pagination} from "nestjs-typeorm-paginate/index";
import {PaginationArticleDto} from "./dto/pagination.article.entity";
import {PaginationArticleInput} from './dto/pagination.article.input';
import {MAX_LIMIT_ON_PAGE} from '../constants/constatnts';
import {ForbiddenException} from "../common/exceptions/forbiddenException";

@Resolver(() => Article)
export class ArticlesResolver {
    constructor(
        private articleService: ArticlesService,
    ) {}

    @Query(() => PaginationArticleDto)
    async getAllArticles(
        @Args('input') data: PaginationArticleInput,
    ): Promise<Pagination<Article>> {
        const limit = data.limit > MAX_LIMIT_ON_PAGE ? MAX_LIMIT_ON_PAGE : data.limit;
        const extendedData = {...data, limit};
        return this.articleService.paginate(extendedData);
    }

    @UseGuards(JwtAuthGuard)
    @Query(() => Article)
    async getOneArticle(@Args('articleId') id: number): Promise<Article> {
        return this.articleService.findArticleByIdWithRelationToAuthor(id);
    }

    @UseGuards(JwtAuthGuard)
    @Query(() => [Article])
    async findArticlesByUserId(@Args('authorId') authorId: number): Promise<Article[]> {
        return this.articleService.findArticlesByUserId(authorId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @Mutation(() => Article)
    async createArticle(
        @CtxUser() user: User,
        @Args('input') data: CreateArticleInput): Promise<Article> {
        return this.articleService.create(user.id, data);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.USER, Role.EDITOR)
    @Mutation( () => Article)
    async updateArticle(
        @CtxUser() user: User,
        @Args('input') data: UpdateArticleInput): Promise<Article> {
        const { author } = await this.articleService.findArticleByIdWithRelationToAuthor(data.id);
        if (Role.USER === user.role && author.id !== user.id) {
            throw new ForbiddenException(`Forbidden for this role`);
        }
        return this.articleService.update(data);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @Mutation(() => Boolean)
    async deleteArticle(
        @CtxUser() user: User,
        @Args('id') id: number): Promise<boolean> {
        const { author } = await this.articleService.findArticleByIdWithRelationToAuthor(id);
        if (Role.USER === user.role && author.id !== user.id) {
            throw new ForbiddenException(`Forbidden for this role`);
        }
        return this.articleService.delete(id);
    }
}
