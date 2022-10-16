import {Field, InputType} from "@nestjs/graphql";
import {ArticleField} from "../../pagination/enums/articleField";
import {SortOrder} from "../../pagination/enums/sortOrder";
import {PAGE, LIMIT} from '../../constants/constatnts';

@InputType()
export class PaginationArticleInput {
    @Field()
    page?: number = PAGE;

    @Field()
    limit?: number = LIMIT;

    @Field()
    sortField?: ArticleField = ArticleField.TITLE;

    @Field()
    sortOrder?: SortOrder = SortOrder.ASC;
}
