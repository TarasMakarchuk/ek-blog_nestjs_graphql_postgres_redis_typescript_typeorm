import {Field, InputType} from "@nestjs/graphql";
import {Role} from "../role/role.enum";

@InputType()
export class CreateUserInput {
    @Field({defaultValue: 'user'})
    role?: Role;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    phoneNumber: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field({nullable: true})
    userAvatar?: string;
}
