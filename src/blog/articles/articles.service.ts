import {Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Article} from "../entities/article.entity";
import {CreateArticleInput} from "./dto/create-article.input";
import {UpdateArticleInput} from "./dto/update-article.input";
import {paginate, Pagination, IPaginationOptions} from 'nestjs-typeorm-paginate';
import {PaginationArticleInput} from "./dto/pagination.article.input";

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article)
        private articleRepository: Repository<Article>,
    ) {}

    findAll(): Promise<Article[]> {
        return this.articleRepository.find();
    };

    findArticlesByUserId(authorId: number): Promise<Article[]> {
        return this.articleRepository.find({
            where: { author: { id: authorId} }});
    }

    async findOne(id: number): Promise<Article> {
        const article = await this.articleRepository.findOne(id);
        if (!article) {
            throw new NotFoundException('Article not found');
        }
        return article;
    };

    async findArticleByIdWithRelationToAuthor(articleId: number): Promise<Article> {
        const article = await this.articleRepository.findOne({
            where: { id: articleId },
            relations: ['author'],
        });
        if (!article) {
            throw new NotFoundException('Article not found');
        }
        return article;
    };

    async create(userId: number, data: CreateArticleInput): Promise<Article> {
        const article = await this.articleRepository.save({ ...data, author: {id: userId} });
        if (!article) {
            throw new InternalServerErrorException('Problem to create a article');
        }
        return article;
    };

    async update(data: UpdateArticleInput): Promise<Article> {
        const { id } = data;
        await this.articleRepository.save(data);
        return await this.articleRepository.findOne(id);
    };

    paginate(data: PaginationArticleInput): Promise<Pagination<Article>> {
        const queryBuilder = this.articleRepository.createQueryBuilder('queryBuilder');
        queryBuilder.orderBy(`queryBuilder.${data.sortField}`, data.sortOrder);
        const {limit, page} = data;
        const options: IPaginationOptions = {limit, page};
        return paginate<Article>(queryBuilder, options);
    };

    async delete(id: number): Promise<boolean> {
        return !!await this.articleRepository.delete(id);
    };
}
