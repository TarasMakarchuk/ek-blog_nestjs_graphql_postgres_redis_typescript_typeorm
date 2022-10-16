import {UsersService} from "./users.service";
import {Test, TestingModule} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import TestUtil from "../common/test/test.util";
import {NotFoundException} from "@nestjs/common";

describe('UserService', () => {
    let service: UsersService;
    let user;

    const mockRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        delete: jest.fn(),
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService, {
                provide: getRepositoryToken(User),
                useValue: mockRepository,
            }],
        }).compile();

        service = module.get<UsersService>(UsersService);
        user = TestUtil.getValidUser();
    });

    beforeEach(() => {
        mockRepository.find.mockReset();
        mockRepository.findOne.mockReset();
        mockRepository.create.mockReset();
        mockRepository.save.mockReset();
        mockRepository.delete.mockReset();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should be a list of all users', async () => {
            mockRepository.find.mockResolvedValue([user, user, user]);
            const users = await service.findAll();

            expect(users).toHaveLength(3);
            expect(mockRepository.find).toHaveBeenCalledTimes(1);
            expect(mockRepository.find).toHaveBeenCalledWith();
            expect(users).toEqual([user, user, user]);
        });
    });

    describe('findOneById', () => {
        it('should find existing user', async () => {
            mockRepository.findOne.mockResolvedValue(user);
            const found = await service.findOneById(1);

            expect(found).toMatchObject({firstName: user.firstName});
            expect(mockRepository.findOne).toHaveBeenCalledWith(1);
            expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
            expect(found).toEqual(user);
        });

        it('throw exception if the user is not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findOneById(9)).rejects.toBeInstanceOf(NotFoundException);
            expect(mockRepository.findOne).toHaveBeenCalledWith(9);
            expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
        });
    });

    describe('create a user', () => {
        it('should create a user', async () => {
            mockRepository.save.mockResolvedValue(user);
            const createdUser = await service.create(user);

            expect(createdUser).toMatchObject(user);
            expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                email: "valid@gmail.com", firstName: "valid", id: 1, lastName: "user",
            }));
            expect(mockRepository.save).toBeCalledTimes(1);
            expect(createdUser).toEqual(user);
        });
    });

    describe('findOneByEmail', () => {
        it('should find existing user', async () => {
            mockRepository.findOne.mockResolvedValue(user);
            const found = await service.findOneByEmail('valid@gmail.com');

            expect(found).toMatchObject({firstName: user.firstName});
            expect(mockRepository.findOne).toHaveBeenCalledWith(expect.objectContaining({
                email: "valid@gmail.com"
            }));
            expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
            expect(found).toEqual(user);
        });
    });

    describe('delete user', () => {
        it('should delete a existing user', async () => {
            mockRepository.delete.mockResolvedValue(user);
            mockRepository.findOne(user);
            const deletedUser = await service.delete(1);

            expect(deletedUser).toBe(true);
            expect(mockRepository.findOne).toHaveBeenCalledWith(expect.objectContaining({
                email: "valid@gmail.com", firstName: "valid", id: 1, lastName: "user"
            }));
            expect(mockRepository.findOne).toBeCalledTimes(1);
            expect(mockRepository.delete).toBeCalledTimes(1);
            expect(mockRepository.delete).toHaveBeenCalledWith(1);
        });

        it('should not delete a existing user', async () => {
            mockRepository.delete.mockResolvedValue(null);
            mockRepository.findOne(user);
            const deletedUser = await service.delete(9);

            expect(deletedUser).toBe(false);
            expect(mockRepository.findOne).toBeCalledTimes(1);
            expect(mockRepository.findOne).not.toHaveBeenCalledWith(expect.objectContaining({
                email: "valid@gmail.com", firstName: "valid", id: 9, lastName: "user"
            }));
            expect(mockRepository.delete).toBeCalledTimes(1);
            expect(mockRepository.delete).toHaveBeenCalledWith(9);
        });
    });
});
