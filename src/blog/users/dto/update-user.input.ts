import {Field, HideField, InputType} from "@nestjs/graphql";
import {Role} from "../role/role.enum";

@InputType()
export class UpdateUserDto {
    @Field()
    id: number;

    @Field({defaultValue: 'user'})
    role?: Role;

    @Field()
    firstName?: string;

    @Field()
    lastName?: string;

    @Field()
    phoneNumber?: string;

    @Field()
    email?: string;

    @Field()
    password?: string;

    @Field()
    userAvatar?: string;

    @HideField()
    confirmed?: boolean;
}
