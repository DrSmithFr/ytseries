import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenMapper, TokenModel } from '../../models/auth/token.model';
import { first, map, Observable } from 'rxjs';
import { UserMapper, UserModel } from '../../models/auth/user.model';
import { UrlService } from './utils/url.service';
import { ApiMessageMapper, ApiMessageModel } from '../../models/api/api-message.model';

// contain every api call to be easily fake using angular provider mechanism
@Injectable(
  {
    providedIn: 'root'
  }
)
export class UserService {
  constructor(
    private http: HttpClient,
    private url: UrlService,
    private tokenMapper: TokenMapper,
    private messageMapper: ApiMessageMapper,
    private userMapper: UserMapper,
  ) {
  }

  // Login related

  login(username: string, password: string): Observable<TokenModel> {
    return this
      .http
      .post<TokenModel>(
        this.url.apiUrlFromPath('/auth/login'),
        {username, password}
      )
      .pipe(
        first(),
        map(this.tokenMapper.fromDto),
        first()
      );
  }

  // Refresh token related

  reconnect(token: string): Observable<TokenModel> {
    return this
      .http
      .post<TokenModel>(
        this.url.apiUrlFromPath('/auth/login/refresh'),
        {
          refresh_token: token,
        }
      )
      .pipe(
        first(),
        map(this.tokenMapper.fromDto),
      );
  }

  getCurrentUser(): Observable<UserModel> {
    return this
      .http
      .get<UserModel>(this.url.apiUrlFromPath('/user/information'))
      .pipe(
        first(),
        map(this.userMapper.fromDto),
      );
  }

  // Register related

  register(
    name: string,
    email: string,
    phone: string,
  ): Observable<TokenModel> {
    return this
      .http
      .post<TokenModel>(
        this.url.apiUrlFromPath('/auth/register'),
        {
          name,
          email,
          phone,
        }
      )
      .pipe(
        first(),
        map(this.tokenMapper.fromDto),
      );
  }

  checkAccountExist(email: string): Observable<ApiMessageModel> {
    return this
      .http
      .post<ApiMessageModel>(this.url.apiUrlFromPath('/auth/register/available'), {username: email})
      .pipe(
        first(),
        map(this.messageMapper.fromDto),
      );
  }

  // Password Reset related

  resetPassword(token: string, password: string): Observable<ApiMessageModel> {
    return this
      .http
      .patch<ApiMessageModel>(this.url.apiUrlFromPath('/auth/reset_password'), {token, password})
      .pipe(
        first(),
        map(this.messageMapper.fromDto),
      );
  }

  resetPasswordRequest(email: string): Observable<ApiMessageModel> {
    return this
      .http
      .post<ApiMessageModel>(this.url.apiUrlFromPath('/auth/reset_password'), {username: email})
      .pipe(
        first(),
        map(this.messageMapper.fromDto),
      );
  }

  checkPasswordResetTokenValidity(token: string): Observable<ApiMessageModel> {
    return this
      .http
      .post<ApiMessageModel>(this.url.apiUrlFromPath('/auth/reset_password/validity'), {token})
      .pipe(
        first(),
        map(this.messageMapper.fromDto),
      );
  }

  // Password Update related

  updatePassword(oldPassword: string, newPassword: string): Observable<ApiMessageModel> {
    return this
      .http
      .patch<ApiMessageModel>(
        this.url.apiUrlFromPath('/v2/user/current/password_update'),
        {
          currentPassword: oldPassword,
          newPassword: newPassword
        }
      )
      .pipe(
        first(),
        map(this.messageMapper.fromDto),
      );
  }
}
