// user.model.ts
import { UserIdentityDto, UserIdentityMapper, UserIdentityModel } from './user-identity.model';
import { AbstractMapper } from '../abstract-mapper';
import { inject, Injectable } from '@angular/core';

export interface UserDto {
  id?: string;
  roles?: string[];
  identity?: UserIdentityDto;
  email?: string;
}

export class UserModel {
  constructor(
    public id: string,
    public roles: string[],
    public identity: UserIdentityModel,
    public email: string
  ) {}
}

@Injectable({ providedIn: 'root' })
export class UserMapper extends AbstractMapper<UserDto, UserModel> {
  override fromDto(dto: UserDto): UserModel {
    return new UserModel(
      this.mapString(dto.id),
      this.mapArray<string>(dto.roles, this.mapString),
      inject(UserIdentityMapper).fromDto(dto.identity ?? {}) as UserIdentityModel,
      this.mapString(dto.email)
    );
  }

  override toDto(model: UserModel): UserDto {
    return {
      id: model.id,
      roles: model.roles,
      identity: inject(UserIdentityMapper).toDto(model.identity),
      email: model.email
    } as UserDto;
  }
}
