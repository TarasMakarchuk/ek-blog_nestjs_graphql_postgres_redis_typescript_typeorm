import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../role/role.enum";
import {ROLES_KEY} from "../decorators/roles.decorator";
import {GqlExecutionContext} from "@nestjs/graphql";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const {...user} = this.getCurrentUser(context);
        if (user.role) {
            return requiredRoles.some(role => user.role === role);
        }

        return true;
    }

    getCurrentUser(context: ExecutionContext) {
      const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req.user;
    }
}
