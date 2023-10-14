import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TouristPrivateGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const userObj = request.user as { sub: string; role: string } | undefined;
    const touristId = request.params.id as string;

    if (!touristId || !userObj) {
      return false;
    }

    if (userObj.role === 'ROOT' || userObj.role === 'EMPLOYEE') {
      return true;
    }

    const tourist = await this.userService.getTouristByUserId(userObj.sub);

    if (!tourist) {
      return false;
    }

    return tourist.id === touristId;
  }
}
