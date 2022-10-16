import {Field, ObjectType} from "@nestjs/graphql";
import {Article} from "./article.entity";
import {PaginationMetaDto} from "../../pagination/dto/pagination.meta";

@ObjectType()
export class PaginationArticleDto {
    @Field( () => [Article] )
    items?: Article[];

    @Field()
    meta?: PaginationMetaDto;
}
