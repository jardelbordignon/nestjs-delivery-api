// https://dev.to/dannypule/exclude-route-from-nest-js-authgaurd-h0
import {
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

type User = {
  id: string
  name: string
}

@Injectable()
export class AuthenticationGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const allowUnauthenticated = this.reflector.get<boolean>(
      'allowUnauthenticated',
      context.getHandler()
    )

    if (allowUnauthenticated) return true

    return super.canActivate(context)
  }

  handleRequest(err: any, user: User, info: any, context: any, status: any) {
    if (info && info.message === 'jwt expired') {
      throw new UnauthorizedException('AccessToken expired')
    }

    return super.handleRequest(err, user, info, context, status)
  }
}

export const AllowUnauthenticated = () => SetMetadata('allowUnauthenticated', true)
