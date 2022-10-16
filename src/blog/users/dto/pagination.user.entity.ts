import {Field, ObjectType} from "@nestjs/graphql";
import {PaginationMetaDto} from "../../pagination/dto/pagination.meta";
import {User} from "./user.entity";

@ObjectType()
export class PaginationUserDto {
    @Field( () => [User] )
    items?: User[];

    @Field()
    meta?: PaginationMetaDto;
}
