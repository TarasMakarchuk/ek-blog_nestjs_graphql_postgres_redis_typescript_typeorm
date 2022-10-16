import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import TestUtil from '../common/test/test.util';
import {ArticlesService} from './articles.service';
import {Article} from '../entities/article.entity';
import {InternalServerErrorException, NotFoundException} from "@nestjs/common";

describe('ArticlesService', () => {
    let service: ArticlesService;
    let article, user;

    const mockRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ArticlesService,
                {
                    provide: getRepositoryToken(Article),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<ArticlesService>(ArticlesService);
        article = TestUtil.getArticle();
        user = TestUtil.getValidUser();
    });

    beforeEach(() => {
        mockRepository.find.mockReset();
        mockRepository.findOne.mockReset();
        mockRepository.create.mockReset();
        mockRepository.update.mockReset();
        mockRepository.save.mockReset();
        mockRepository.delete.mockReset();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('find all articles', () => {
        it('should be list all articles', async () => {
            mockRepository.find.mockResolvedValue([article, article, article]);
            const articles = await service.findAll();

            expect(articles).toHaveLength(3);
            expect(mockRepository.find).toHaveBeenCalledTimes(1);
            expect(mockRepository.find).toHaveBeenCalledWith();
            expect(articles).toEqual([article, article, article]);
        });
    });

    describe('find articles by user id', () => {
        it('should find existing articles owned by the same author', async () => {
            mockRepository.find.mockResolvedValue([article, article, article]);
            const found = await service.findArticlesByUserId(1);

            expect(found).toHaveLength(3);
            found.forEach(item => expect(item).toMatchObject({author: {id: user.id}}))
            expect(found).toEqual([article, article, article])
            expect(mockRepository.find).toHaveBeenCalledWith(
                {where: {author: {id: 1}}}
            );
            expect(mockRepository.find).toHaveBeenCalledTimes(1);
        });

        it('throw exception if no article is found', async () => {
            mockRepository.findOne.mockResolvedValue(null);
            await expect(service.findOne(9)).rejects.toBeInstanceOf(NotFoundException);
            expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
        });
    });

    describe('find one article by id', () => {
        it('should find existing article', async () => {
            mockRepository.findOne.mockResolvedValue(article);
            const found = await service.findOne(article.id);

            expect(mockRepository.findOne).toHaveBeenCalledWith(article.id);
            expect(found).toMatchObject({id: article.id});
            expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
            expect(found).toEqual(article);
        });

        it('return exception if article is not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);
            await expect(service.findOne(9)).rejects.toBeInstanceOf(NotFoundException);

            expect(mockRepository.findOne).not.toHaveBeenCalledWith(article.id);
            expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
        });
    });

    describe('find article by id with relation to author', () => {
        it('should find existing article with relation to author', async () => {
            mockRepository.findOne.mockResolvedValue(article);
            const found = await service.findArticleByIdWithRelationToAuthor(article.id);

            expect(found).toMatchObject({author: {id: article.author.id}});
            expect(mockRepository.findOne).toHaveBeenCalledWith(
                {relations: ["author"], where: {id: 1}}
            );
            expect(found.author).toMatchObject(article.author);
            expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
            expect(found).toEqual(article);
        });

        it('throw exception if article with relation to author is not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);
            await expect(service.findArticleByIdWithRelationToAuthor(9)).rejects.toBeInstanceOf(NotFoundException);

            expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
        });
    });

    describe('create article', () => {
        it('should create an article', async () => {
            mockRepository.save.mockResolvedValue(article);
            const createdArticle = await service.create(user.id, article);

            expect(createdArticle).toMatchObject(article);
            expect(mockRepository.save).toBeCalledTimes(1);
            expect(mockRepository.save).toHaveBeenCalledWith(
                {author: {id: 1}, content: "test content", id: 1, title: "test article"}
            );
            expect(createdArticle).toEqual(article);
        });

        it('throw exception if article is not created', async () => {
            mockRepository.save.mockRejectedValue(new InternalServerErrorException('Problem to create a article'));

            await expect(service.create(user.id, article)).rejects.toBeInstanceOf(InternalServerErrorException);
            await expect(service.create(user.id, article)).rejects.toMatchObject({
                message: 'Problem to create a article',
            });
        });
    });

    describe('update article', () => {
        it('should be update article', async () => {
            const newTitle = {title: 'Title updated'};
            mockRepository.findOne.mockResolvedValue(article);
            mockRepository.save.mockResolvedValue({...article, ...newTitle});
            const result = await service.update({...article, ...newTitle});
            const updatedArticle = await service.findOne(article.id);

            expect(result).toMatchObject(updatedArticle);
            expect(mockRepository.save).toBeCalledTimes(1);
            expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                content: "test content", id: 1, title: "Title updated"
            }));
            expect(mockRepository.findOne).toBeCalledTimes(2);
            expect(mockRepository.findOne).toHaveBeenCalledWith(1);
            expect(result).toEqual(updatedArticle);
            expect(mockRepository.findOne).toHaveBeenCalledWith(article.id);
        });
    });

    describe('delete article', () => {
        it('should delete an existing article', async () => {
            await mockRepository.delete.mockResolvedValue(article);
            mockRepository.findOne(article);
            const deletedUser = await service.delete(1);

            expect(deletedUser).toBe(true);
            expect(mockRepository.findOne).toBeCalledTimes(1);
            expect(mockRepository.findOne).toHaveBeenCalledWith(expect.objectContaining({
                content: "test content", id: 1, title: "test article"
            }));
            expect(mockRepository.delete).toBeCalledTimes(1);
            expect(mockRepository.delete).toHaveBeenCalledWith(1);
        });

        it('should not delete an not existing article', async () => {
            await mockRepository.delete.mockResolvedValue(null);
            mockRepository.findOne(article);
            const deletedUser = await service.delete(9);

            expect(deletedUser).toBe(false);
            expect(mockRepository.findOne).toBeCalledTimes(1);
            expect(mockRepository.findOne).not.toHaveBeenCalledWith(expect.objectContaining({
                content: "test content", id: 9, title: "test article"
            }));
            expect(mockRepository.delete).toBeCalledTimes(1);
            expect(mockRepository.delete).toHaveBeenCalledWith(9);
        });
    });
});
