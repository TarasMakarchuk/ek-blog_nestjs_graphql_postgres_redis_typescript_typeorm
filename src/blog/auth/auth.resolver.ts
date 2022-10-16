import {Args, Mutation, Resolver} from "@nestjs/graphql";
import {AuthService} from "./auth.service";
import {UserToken} from "../users/dto/user-token.entity";
import {CreateUserInput} from "../users/dto/create-user.input";
import {AuthLoginInput} from "./dto/auth-login.input";
import {RequestResetPasswordInput} from "./dto/request-reset-password.input";
import {ResetPasswordInput} from "./dto/reset-password.input";
import {ChangePasswordInput} from "./dto/change-password.input";
import {CtxUser} from "../users/decorators/ctx-user.decorator";
import {User} from "../users/dto/user.entity";
import {UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "./guards/jwt-auth-guard";
import {TokenIdRequiredException} from "../common/exceptions/tokenIdRequiredException";

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) {}

    @Mutation(() => UserToken)
    async login(@Args({name: 'input', type: () => AuthLoginInput}) data: AuthLoginInput) {
        return this.authService.login(data);
    }

    @Mutation(() => UserToken)
    async registration(@Args({name: 'input', type: () => CreateUserInput}) data: CreateUserInput) {
        const user = await this.authService.registration(data);
        await this.authService.sendNewUserRegistrationEmail(user);
        return user;
    }

    @Mutation(() => String)
    async confirmUserRegistration(
        @Args({name: 'input', type: () => String}) data: string
    ): Promise<string> {
        if(!data) {
            throw new TokenIdRequiredException();
        }
        await this.authService.confirmUserRegistration(data);

      return `User registration completed successfully`;
    }

    @Mutation(() => String)
    async requestResetPassword(
        @Args({name: 'input', type: () => RequestResetPasswordInput}) data: RequestResetPasswordInput
    ): Promise<string> {
        await this.authService.requestResetPassword(data);

        return `Password reset email was sent`;
    }

    @Mutation(() => String)
    async resetPassword(
        @Args({name: 'input', type: () => ResetPasswordInput}) data: ResetPasswordInput
    ): Promise<string> {
        await this.authService.resetPassword(data);

        return `Password was reset successfully`;
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => String)
    async changePassword(
        @CtxUser() user: User,
        @Args( {name: 'input', type: () => ChangePasswordInput}) data: ChangePasswordInput
    ): Promise<string> {
        await this.authService.changePassword(data, user.id);

        return `Password was changed successfully`;
    }
}
