import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class ResetPasswordInput {
    @Field()
    tokenId: string;

    @Field()
    password: string;

    @Field()
    confirmPassword: string;
}
