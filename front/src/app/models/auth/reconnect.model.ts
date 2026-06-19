// reconnect.model.ts
import { TokenDto, TokenMapper, TokenModel } from './token.model';
import { AbstractMapper } from '../abstract-mapper';
import { UserModel, UserMapper, UserDto } from './user.model';
import { inject, Injectable } from '@angular/core'; // Assumes UserModel exists

export interface ReconnectDto {
  token?: TokenDto;
  user?: UserDto;
}

export class ReconnectModel {
  constructor(
    public token: TokenModel,
    public user: UserModel
  ) {}
}

@Injectable({ providedIn: 'root' })
export class ReconnectMapper extends AbstractMapper<ReconnectDto, ReconnectModel> {
  override fromDto(dto: ReconnectDto): ReconnectModel {
    throw new Error('Virtual Model: CANNOT BE RETRIEVE FROM API')
  }

  override toDto(model: ReconnectModel): ReconnectDto {
    return {
      token: inject(TokenMapper).toDto(model.token),
      user: inject(UserMapper).toDto(model.user)
    } as ReconnectDto;
  }
}
