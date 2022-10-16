import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from '../entities/user.entity';
import {UsersModule} from "../users/users.module";
import {AuthService} from "./auth.service";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {JwtAuthGuard} from "./guards/jwt-auth-guard";
import {AuthResolver} from "./auth.resolver";
import {RolesGuard} from "../users/guards/roles.guard";
import {LocalAuthGuard} from "./guards/local-auth.guard";
import {BullModule} from "@nestjs/bull";
import {SendEmailConsumer} from "./queues/send-email.consumer";
import {MailModule} from "../mail/mail.module";
import {MailService} from "../mail/mail.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        UsersModule,
        PassportModule,
        MailModule,
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: process.env.JWT_SECRET,
                signOptions: {expiresIn: process.env.JWT_EXPIRES_IN},
            })
        }),
        BullModule.registerQueue({
            name: 'send-user-email-queue',
        }),
    ],
    providers: [
        AuthService,
        MailService,
        AuthResolver,
        JwtStrategy,
        LocalAuthGuard,
        JwtAuthGuard,
        RolesGuard,
        SendEmailConsumer,
    ],
    exports: [AuthService, AuthResolver, TypeOrmModule],
})
export class AuthModule {}
