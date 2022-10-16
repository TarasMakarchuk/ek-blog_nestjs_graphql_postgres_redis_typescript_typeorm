import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class RequestResetPasswordInput {
    @Field()
    email: string;
}
