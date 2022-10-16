import {Field, ID, ObjectType} from "@nestjs/graphql";
import { User } from "../../users/dto/user.entity";

@ObjectType()
export class Article {
    @Field(() => ID)
    id?: number;

    @Field()
    title?: string;

    @Field()
    content?: string;

    @Field(() => User)
    author?: User;

    @Field(() => Date)
    createdAt?: string;

    @Field(() => Date)
    updatedAt?: string;
}
