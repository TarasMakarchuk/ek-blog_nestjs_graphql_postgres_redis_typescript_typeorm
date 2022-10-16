import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {UsersService} from "./users.service";
import {CreateUserInput} from "./dto/create-user.input";
import {User} from './dto/user.entity';
import {Logger, UseGuards, UseInterceptors} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/guards/jwt-auth-guard";
import {Roles} from "./decorators/roles.decorator";
import {RolesGuard} from "./guards/roles.guard";
import {Role} from "./role/role.enum";
import {Pagination} from "nestjs-typeorm-paginate/index";
import {PaginationUserDto} from "./dto/pagination.user.entity";
import {PaginationUserInput} from "./dto/pagination.article.input";
import {MAX_IMAGE_FILE_SIZE_UPLOAD, MAX_LIMIT_ON_PAGE, IMAGE_PATH} from "../constants/constatnts";
import {FileUpload, GraphQLUpload} from "graphql-upload";
import {createWriteStream} from "fs";
import {CtxUser} from "./decorators/ctx-user.decorator";
import {
    validateAvatarExtension,
    validateAvatar,
    createFoldersForAvatar,
    sharpResizeAvatar, isAvatarSelected,
} from "../helpers/user-avatar-upload.helper";
import {UserAvatarUploadInterceptor} from "./interceptors/user-avatar-upload-interceptor.service";
import { join } from "path";

@Resolver(() => User)
export class UsersResolver {
    constructor(private userService: UsersService) {}

    @Roles(Role.EDITOR, Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(new UserAvatarUploadInterceptor())
    @Query(() => PaginationUserDto)
    async getAllUsers(
        @Args('input') data: PaginationUserInput
    ): Promise<Pagination<User>> {
        const limit = data.limit > MAX_LIMIT_ON_PAGE ? MAX_LIMIT_ON_PAGE : data.limit;
        const extendedData = {...data, limit};
        return this.userService.paginate(extendedData);
    };

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Mutation(() => String)
    async uploadAvatar(@CtxUser() user: User, @Args({name: 'file', type: () => GraphQLUpload})
        {createReadStream, filename, mimetype}: FileUpload): Promise<String> {
        const path = join(IMAGE_PATH, filename);

        createFoldersForAvatar();

        const fileUpload = async () => {
            const file = createWriteStream(path);
            return new Promise(async (resolve, reject) =>
                createReadStream()
                    .pipe(file)
                    .on('finish', () => file.close(() => resolve(true)))
                    .on('error', (err) => {
                        Logger.error(err);
                        reject(false);
                    })
            );
        };

        isAvatarSelected(filename);
        validateAvatarExtension(mimetype);
        await validateAvatar(createReadStream, MAX_IMAGE_FILE_SIZE_UPLOAD);
        await fileUpload();
        await sharpResizeAvatar(path, filename);
        await this.userService.updateUser({id: user.id, userAvatar: filename});

        return `Avatar ${filename} was uploaded`;
    };

    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Mutation( () => User)
    async createUser(@Args('input') data: CreateUserInput): Promise<User> {
        return this.userService.create(data);
    };

    @Roles(Role.ADMIN, Role.EDITOR)
    @Query(() => User)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async findUserById(@Args('id') id: number): Promise<User> {
        return this.userService.findOneById(id);
    };

    @Roles(Role.ADMIN, Role.EDITOR)
    @Query(() => User)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async findUserByEmail(@Args('email') email: string): Promise<User> {
        return this.userService.findOneByEmail(email);
    };

    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Mutation( () => Boolean)
    deleteUser(@Args('id') id: number): Promise<boolean> {
        return this.userService.delete(id);
    };
}
