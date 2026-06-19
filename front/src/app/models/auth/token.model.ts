// token.model.ts
import { AbstractMapper } from '../abstract-mapper';
import { Injectable } from '@angular/core';

export interface TokenDto {
  token?: string;
  refresh_token?: string;
}

export class TokenModel {
  constructor(
    public token: string,
    public refresh_token: string
  ) {}
}

@Injectable({ providedIn: 'root' })
export class TokenMapper extends AbstractMapper<TokenDto, TokenModel> {
  override fromDto(dto: TokenDto): TokenModel {
    return new TokenModel(
      this.mapString(dto.token),
      this.mapString(dto.refresh_token)
    );
  }

  override toDto(model: TokenModel): TokenDto {
    return {
      token: model.token,
      refresh_token: model.refresh_token
    } as TokenDto;
  }
}
