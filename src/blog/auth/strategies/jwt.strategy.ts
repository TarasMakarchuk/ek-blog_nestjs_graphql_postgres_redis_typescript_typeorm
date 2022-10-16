import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {ConfigModule} from "@nestjs/config";
import {JwtDto} from "../dto/jwt.dto";
import {UsersService} from "../../users/users.service";

ConfigModule.forRoot();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
            usernameField: 'email',
        });
    }

    async validate(payload: JwtDto) {
        const user = await this.usersService.findOneById(payload.userId);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
