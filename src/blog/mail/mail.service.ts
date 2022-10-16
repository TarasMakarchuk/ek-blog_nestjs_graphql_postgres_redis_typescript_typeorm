import { MailerService } from '@nestjs-modules/mailer';
import {Injectable} from '@nestjs/common';
import { createUrlUserNotifyEmail } from '../helpers/createUrlUserNotifyEmail';
import {User} from "../users/dto/user.entity";

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendUserRegistrationEmail(user: User, token: string) {
        const link = `${process.env.BASE_URL}/auth/registration/confirm`;
        const url = await createUrlUserNotifyEmail(token, link);
        await this.mailerService.sendMail({
            to: user.email,
            from: `EK-Blog's support team <${process.env.SMTP_SUPPORT_EMAIL}>`,
            subject: 'Email confirmation',
            template: '/**/confirmation',
            context: {
                name: `${user.firstName} ${user.lastName}`,
                url,
            },
        });
    }

    async sendResetPasswordEmail(user: User, token: string) {
        const link = `${process.env.BASE_URL}/auth/reset-password`;
        const url = await createUrlUserNotifyEmail(token, link);
        await this.mailerService.sendMail({
            to: user.email,
            from: `EK-Blog's support team <${process.env.SMTP_SUPPORT_EMAIL}>`,
            subject: 'Reset password',
            template: '/**/resetPassword.hbs',
            context: {
                name: `${user.firstName} ${user.lastName}`,
                url,
            },
        });
    }
}
