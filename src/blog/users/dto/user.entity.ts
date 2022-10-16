import {Field, ID, ObjectType} from "@nestjs/graphql";
import { Article } from "../../articles/dto/article.entity";
import {Role} from "../role/role.enum";

@ObjectType()
export class User {
    @Field(() => ID)
    id?: number;

    @Field()
    role?: Role;

    @Field()
    firstName?: string;

    @Field()
    lastName?: string;

    @Field()
    phoneNumber?: string;

    @Field()
    email?: string;

    @Field({nullable: true})
    userAvatar?: string;

    @Field(() => [Article])
    articles?: Article[];

    @Field(() => Date)
    createdAt?: string;

    @Field(() => Date)
    updatedAt?: string;
}
