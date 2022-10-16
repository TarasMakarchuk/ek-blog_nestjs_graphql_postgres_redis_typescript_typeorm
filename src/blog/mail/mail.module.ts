import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host:  process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT), //465 or 587
        secure: true,
        auth: {
          user: process.env.SMTP_SUPPORT_EMAIL,
          pass: process.env.SMTP_SUPPORT_PASSWORD,
        },
      },
      defaults: {
        from: `"No reply" <${process.env.SMTP_SUPPORT_EMAIL}>`,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
