import {
  CanActivate,
  ExecutionContext,
  Type,
  UnauthorizedException,
  mixin,
} from '@nestjs/common'
import type { Role } from '@prisma/client'

import { AuthenticationGuard } from '.'

type Props = {
  roles?: Role[]
  permissions?: string[] // Permission[]
  needAll?: boolean
}

const AuthorizationGuard = (props: Props): Type<CanActivate> => {
  const { roles, permissions, needAll } = props

  class AuthorizationGuardMixin extends AuthenticationGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context)

      const { user } = context.switchToHttp().getRequest()

      if (!user) return false

      // console.log('user roles', user.roles)
      // console.log('user permissions', user.permissions)
      // console.log('endpoint roles', roles)
      // console.log('endpoint permissions', permissions)

      const condition = needAll ? 'every' : 'some'

      if (roles && roles.length) {
        if (!user.roles || !roles[condition](r => user.roles.includes(r)))
          throw new UnauthorizedException('Role required')
      }

      if (permissions && permissions.length) {
        if (
          !user.permissions ||
          !permissions[condition](p => user.permissions.includes(p))
        ) {
          throw new UnauthorizedException('Permission required')
        }
      }

      return true
    }
  }

  return mixin(AuthorizationGuardMixin)
}

export { AuthorizationGuard }
