// user-identity.model.ts
import { AbstractMapper } from '../abstract-mapper';
import { Injectable } from '@angular/core';

export interface UserIdentityDto {
  name?: string;
  phone?: string;
}

export class UserIdentityModel {
  constructor(
    public name: string,
    public phone: string
  ) {}
}

@Injectable({ providedIn: 'root' })
export class UserIdentityMapper extends AbstractMapper<UserIdentityDto, UserIdentityModel> {
  override fromDto(dto: UserIdentityDto): UserIdentityModel {
    return new UserIdentityModel(
      this.mapString(dto.name),
      this.mapString(dto.phone)
    );
  }

  override toDto(model: UserIdentityModel): UserIdentityDto {
    return {
      name: model.name,
      phone: model.phone
    } as UserIdentityDto;
  }
}
