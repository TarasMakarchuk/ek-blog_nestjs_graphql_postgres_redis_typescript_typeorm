import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class CreateArticleInput {
    @Field()
    title: string;

    @Field()
    content: string;
}
