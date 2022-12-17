import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { UserService } from '../user/user.service'

type Payload = {
  sub: string // user id
  name: string
}

// https://stackoverflow.com/questions/60042350/customise-the-response-on-verification-failure-for-a-jwt-strategy-nestjs
// https://docs.nestjs.com/exception-filters#exception-filters-1
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      //passReqToCallback: true,
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  async validate(payload: Payload) {
    return this.userService.findFirstById(payload.sub)
  }
}
