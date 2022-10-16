import {
    ArgumentsHost,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';
import {GqlArgumentsHost} from "@nestjs/graphql";
import {getCurrentISODateTime} from 'src/blog/helpers/currentIsoDateTime';
import {GraphQLResolveInfo} from "graphql";

export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const gqlHost = GqlArgumentsHost.create(host);
        const info = gqlHost.getInfo<GraphQLResolveInfo>();

        const error = {
            type: info.parentType,
            field: info.fieldName,
            timestamp: getCurrentISODateTime(),
        };

        // @ts-ignore
        if (process.env.NODE_ENV !== 'prod') exception.details = error;

        return exception;
    }
}
