import {Injectable} from "@nestjs/common";
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import {CreateUserInput} from "../users/dto/create-user.input";
import {UserToken} from "../users/dto/user-token.entity";
import {AuthLoginInput} from "./dto/auth-login.input";
import {AuthHelper, isUserConfirmed} from "../helpers/auth.helper";
import {JwtDto} from "./dto/jwt.dto";
import {InjectQueue} from "@nestjs/bull";
import {Queue} from "bull";
import {User} from "../entities/user.entity";
import { redis } from "../../redis";
import {RequestResetPasswordInput} from "./dto/request-reset-password.input";
import {MailService} from "../mail/mail.service";
import {ResetPasswordInput} from "./dto/reset-password.input";
import {ChangePasswordInput} from "./dto/change-password.input";
import {UserNotFoundException} from "../common/exceptions/userNotFoundException";
import {InvalidCredentialsException} from "../common/exceptions/invalidCredentialsException";
import {PasswordsShouldMatchException} from "../common/exceptions/passwordsShouldMatchException";
import {CantRegisterWithEmailException} from "../common/exceptions/cantRegisterWithEmailException";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private mailService: MailService,
        @InjectQueue('send-user-email-queue') private queue: Queue,
    ) {}

    public async login(input: AuthLoginInput): Promise<UserToken> {
        const user = await this.findUser(input.email);
        await this.validatePassword(input.password, user.password);

        isUserConfirmed(user.confirmed);

        delete user.password;

        return {user, token: this.signToken(user.id)};
    };

    public async registration(input: CreateUserInput): Promise<UserToken> {
        const found = await this.usersService.findOneByEmail(input.email);
        if (found) {
            throw new CantRegisterWithEmailException(`Cannot register with this email ${input.email}`);
        }

        const userPassword = await AuthHelper.hash(input.password);
        const user = await this.usersService.create({
            ...input,
            password: userPassword,
        });
        delete user.password;

        return {user, token: this.signToken(user.id)};
    };

    async sendNewUserRegistrationEmail(data: UserToken) {
        await this.queue.add('new-user-registration-job', data, { delay: 10000 });
    };

    private signToken(id: number) {
        const payload: JwtDto = {userId: id};
        return this.jwtService.sign(payload);
    };

    public async validatePassword(inputPassword, foundPassword): Promise<Boolean> {
        const validate = await AuthHelper.validateHash(inputPassword, foundPassword);
        if (!validate) {
            throw new InvalidCredentialsException();
        }

        return validate;
    };

    public async findUser(email): Promise<User> {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new UserNotFoundException();
        }

        return user;
    };

    public async confirmUserRegistration(tokenId: string): Promise<void> {
        const token = await redis.get(tokenId);
        const { userId } = this.jwtService.verify(token);
        await this.usersService.updateUser({ id: userId, confirmed: true } );
        await redis.del(tokenId);
    };

    public async requestResetPassword(data: RequestResetPasswordInput): Promise<void> {
        const user = await this.usersService.findOneByEmail(data.email);
        if (!user) {
            throw new CantRegisterWithEmailException();
        }

        isUserConfirmed(user.confirmed);
        const token = this.signToken(user.id);

        await this.mailService.sendResetPasswordEmail(user, token);
    };

    public async resetPassword(data: ResetPasswordInput): Promise<void> {
        const { tokenId, password, confirmPassword } = data;
        if (password !== confirmPassword) {
            throw new PasswordsShouldMatchException();
        }

        const newPassword = await AuthHelper.hash(password);
        const token = await redis.get(tokenId);
        const {userId} = this.jwtService.verify(token);
        await this.usersService.updateUser({id: userId, password: newPassword});
        await redis.del(tokenId);
    };

    public async changePassword(data: ChangePasswordInput, userId: number): Promise<void> {
        const { currentPassword, password, confirmPassword } = data;
        const user = await this.usersService.findOneById(userId);

        await this.validatePassword(currentPassword, user.password);

        if (password !== confirmPassword) {
            throw new PasswordsShouldMatchException();
        }

        const newPassword = await AuthHelper.hash(password);
        await this.usersService.updateUser({id: userId, password: newPassword});
    };
}
