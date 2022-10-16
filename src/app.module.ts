import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {GraphQLModule} from "@nestjs/graphql";
import {ArticlesModule} from './blog/articles/articles.module';
import {ConfigModule} from "@nestjs/config";
import {getConnectionOptions} from "typeorm";
import {UsersModule} from "./blog/users/users.module";
import {AuthModule} from "./blog/auth/auth.module";
import {APP_FILTER, APP_GUARD} from "@nestjs/core";
import {RolesGuard} from "./blog/users/guards/roles.guard";
import {BullModule} from "@nestjs/bull";
import { ServeStaticModule } from "@nestjs/serve-static";
import {join} from 'path';
import {getRedisOptions} from "./blog/constants/redis";
import {HttpExceptionFilter} from "./blog/common/exception-filters/http-exception.filter";

@Module({
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        }
    ],
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            useFactory: async () =>
                Object.assign(await getConnectionOptions(), {
                    autoLoadEntities: true,
                    dropSchema: false,
                    synchronize: false,
                    migrationsRun: false,
                }),
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public', ),
        }),
        GraphQLModule.forRoot({
            debug: process.env.NODE_ENV !== 'prod',
            playground: true,
            include: [ArticlesModule, UsersModule, AuthModule],
            installSubscriptionHandlers: true,
            context: (params) => params,
            // typePaths: ['src/**/*.graphql'],
            // definitions: {path: join(process.cwd(),'src/generated-types/*.ts')},
            autoSchemaFile: 'src/schemas/schema.graphql',
        }),
        BullModule.forRoot({
            redis: getRedisOptions(),
        }),
        ArticlesModule,
        UsersModule,
        AuthModule,
    ],
})

export class AppModule {}
