import {
  CanActivate,
  ExecutionContext,
  Type,
  UnauthorizedException,
  mixin,
} from '@nestjs/common'
import type { Role } from '@prisma/client'

import { pluralize, replaceLastComa } from '../utils/text-formatters'

import { AuthenticationGuard } from '.'

type Props = {
  roles?: Role[]
  permissions?: string[] // Permission[]
  needAll?: boolean
  needAllRoles?: boolean
  needAllPermissions?: boolean
}

const unauthorizedMsg = (
  rolesCondition: 'every' | 'some',
  permissionsCondition: 'every' | 'some',
  neededRoles: Role[],
  neededPermissions: string[]
) => {
  let msg = 'You need'

  if (neededRoles.length) {
    const neededRolesToStr = replaceLastComa(neededRoles.join(', '))
    const roleWord = pluralize(neededRoles.length, 'role')
    const neededRolesMsg =
      rolesCondition === 'some'
        ? ` some role between ${neededRolesToStr}`
        : ` ${neededRolesToStr} ${roleWord}`

    msg += neededRolesMsg
  }

  if (neededPermissions.length) {
    const neededPermissionsToStr = replaceLastComa(neededPermissions.join(', '))
    const permissionWord = pluralize(neededPermissions.length, 'permission')
    const neededPermissionsMsg =
      permissionsCondition === 'some'
        ? ` some permission between ${neededPermissionsToStr}`
        : ` ${neededPermissionsToStr} ${permissionWord}`

    if (neededRoles.length) msg += ' and'
    msg += neededPermissionsMsg
  }

  msg += '.'

  return msg
}

const AuthorizationGuard = (props: Props): Type<CanActivate> => {
  const { roles, permissions, needAll, needAllRoles, needAllPermissions } = props

  class AuthorizationGuardMixin extends AuthenticationGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context)

      const { user } = context.switchToHttp().getRequest()

      if (!user) return false

      // console.log('user roles', user.roles)
      // console.log('user permissions', user.permissions)
      // console.log('endpoint roles', roles)
      // console.log('endpoint permissions', permissions)

      const rolesCondition = needAll || needAllRoles ? 'every' : 'some'
      const permissionsCondition = needAll || needAllPermissions ? 'every' : 'some'
      let neededRoles = []
      let neededPermissions = []

      if (roles && roles.length) {
        if (!user.roles || !roles[rolesCondition](r => user.roles.includes(r)))
          neededRoles = roles.filter(r => !user.roles.includes(r))
      }

      if (permissions && permissions.length) {
        if (
          !user.permissions ||
          !permissions[permissionsCondition](p => user.permissions.includes(p))
        )
          neededPermissions = permissions.filter(r => !user.permissions.includes(r))
      }

      if (neededRoles.length || neededPermissions.length) {
        throw new UnauthorizedException(
          unauthorizedMsg(
            rolesCondition,
            permissionsCondition,
            neededRoles,
            neededPermissions
          )
        )
      }

      return true
    }
  }

  return mixin(AuthorizationGuardMixin)
}

export { AuthorizationGuard }
