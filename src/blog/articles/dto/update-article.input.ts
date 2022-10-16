import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class UpdateArticleInput {
    @Field()
    id: number;

    @Field({nullable: true})
    title?: string;

    @Field({nullable: true})
    content?: string;
}
