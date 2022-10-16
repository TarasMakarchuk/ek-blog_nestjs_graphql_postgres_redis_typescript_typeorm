import {Field, InputType} from "@nestjs/graphql";
import {SortOrder} from "../../pagination/enums/sortOrder";
import {PAGE, LIMIT} from '../../constants/constatnts';
import {UserField} from "../../pagination/enums/userField";

@InputType()
export class PaginationUserInput {
    @Field()
    page?: number = PAGE;

    @Field()
    limit?: number = LIMIT;

    @Field()
    sortField?: UserField = UserField.FIRST_NAME;

    @Field()
    sortOrder?: SortOrder = SortOrder.ASC;
}
