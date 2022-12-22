/**
// https://progressivecoder.com/how-to-create-a-nestjs-custom-decorator/
@Post('/employees')
createEmployee(@User('firstName') firstName: string) {
    console.log(firstName);
}
*/
import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const User = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const user = request.body.user
  return data ? user?.[data] : user
})
