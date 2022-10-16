import {Process, Processor} from "@nestjs/bull";
import {Job} from "bull";
import {MailService} from "../../mail/mail.service";
import {UserToken} from "../../users/dto/user-token.entity";

@Processor('send-user-email-queue')
export class SendEmailConsumer {
    constructor(private mailService: MailService) {}

    @Process('new-user-registration-job')
    public async userRegistrationJob(job: Job<UserToken>) {
        await this.mailService.sendUserRegistrationEmail(job.data.user, job.data.token);
    };
}
