import {Test, TestingModule} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import TestUtil from "../common/test/test.util";
import {AuthService} from "./auth.service";
import {UsersService} from "../users/users.service";
import {mocked} from "jest-mock";
import * as bcryptjs from "bcryptjs";
import {AuthHelper} from "../helpers/auth.helper";

jest.mock('bcryptjs');

describe('AuthService', () => {
    let usersService: UsersService;
    let authService: AuthService;
    let user, loggedInUser, registrationUser, registeredUser;

    const mockRepositoryUsers = {
        findOne: jest.fn(),
        create: jest.fn(),
        findOneByEmail: jest.fn(),
    };

    const mockRepositoryAuth = {
        login: jest.fn(),
        registration: jest.fn(),
        validatePassword: jest.fn(),
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService,
                {
                    provide: AuthService,
                    useValue: mockRepositoryAuth,
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepositoryUsers,
                },
            ],
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        authService = module.get<AuthService>(AuthService);
        user = TestUtil.getValidUser();
        loggedInUser = TestUtil.getLoggedInUser();
        registrationUser = TestUtil.getValidUserRegistration();
        registeredUser = TestUtil.getRegisteredUser();
    });

    beforeEach(() => {
        mockRepositoryUsers.create.mockReset();
        mockRepositoryUsers.findOne.mockReset();
        mockRepositoryAuth.login.mockReset();
        mockRepositoryAuth.registration.mockReset();
        mockRepositoryAuth.validatePassword.mockReset();
    });

    it('should be defined', () => {
        expect(usersService).toBeDefined();
        expect(authService).toBeDefined();
    });

    describe('login and registration user', () => {
        it('should be login if user exists', async () => {
            const expectTokenField = {token: 'user_token'};
            mockRepositoryAuth.login.mockResolvedValue(loggedInUser);
            mockRepositoryUsers.findOne.mockResolvedValue(user);
            const foundUser = await usersService.findOneByEmail(user.email);
            const {email, password} = foundUser;
            const result = await authService.login({email, password});

            expect(mockRepositoryUsers.findOne).toHaveBeenCalledWith({email});
            expect(mockRepositoryAuth.login).toHaveBeenCalledWith({email, password});
            expect(foundUser).toEqual(user);

            expect(mockRepositoryUsers.findOne).toHaveBeenCalledTimes(1);
            expect(mockRepositoryAuth.login).toHaveBeenCalledTimes(1);
            expect(result).toEqual(loggedInUser);
            expect(result).toMatchObject(expectTokenField);
        });

        it('throw exception if user not exists', async () => {
            mockRepositoryUsers.findOne.mockRejectedValue(new Error(`Invalid credentials`));

            await expect(usersService.findOneByEmail(user.email)).rejects.toThrow(Error);
            await expect(usersService.findOneByEmail(user.email)).rejects.toMatchObject({
                message: `Invalid credentials`,
            });
        });

        it('throw exception if user password not valid', async () => {
            // @ts-ignore
            mocked(bcryptjs.compare).mockResolvedValue(false);
            const result = await AuthHelper.validateHash('111', '222');
            mockRepositoryAuth.validatePassword.mockRejectedValue(new Error(`Invalid credentials`));

            expect(result).toEqual(false);
            await expect(authService.validatePassword('111', '222')).rejects.toThrow(Error);
            await expect(authService.validatePassword('111', '222')).rejects.toMatchObject({
                message: `Invalid credentials`,
            });
        });

        it('should be registration user', async () => {
            const expectTokenField = {token: 'user_token'};
            mockRepositoryUsers.findOne.mockResolvedValue(registrationUser);
            mockRepositoryUsers.create.mockResolvedValue(registrationUser);
            mockRepositoryAuth.registration.mockResolvedValue(registeredUser);
            const foundUser = await usersService.findOneByEmail(registrationUser.email);
            const {email} = foundUser;
            const result = await authService.registration(registrationUser);

            expect(mockRepositoryUsers.findOne).toHaveBeenCalledWith({email});
            expect(mockRepositoryAuth.registration).toHaveBeenCalledWith(registrationUser);
            expect(foundUser).toEqual(registrationUser);
            expect(result).toEqual(registeredUser);

            expect(mockRepositoryUsers.findOne).toHaveBeenCalledTimes(1);
            expect(mockRepositoryAuth.registration).toHaveBeenCalledTimes(1);
            expect(result).toMatchObject(expectTokenField);
        });
    });
});
