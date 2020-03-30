import {Injectable} from '@angular/core';
import {BehaviorSubject, merge} from 'rxjs';
import {mapTo, take} from 'rxjs/operators';
import {TokenModel} from '../models/token.model';
import {UserModel} from '../models/user.model';

// allow values and objects to be store on client side
// using BehaviorSubject to keep the all thing synchronous
@Injectable(
  {
    providedIn: 'root'
  }
)
export class StateService {

  constructor() {
    this.initState();
    this.listenToStateChangesAndSave();
  }

  REDIRECT_AFTER_LOGIN: BehaviorSubject<string>;

  // keep current app locale
  LOCALE: BehaviorSubject<string>;

  // JWT token for API calls
  TOKEN: BehaviorSubject<TokenModel>;

  // current USER model
  LOGGED_USER: BehaviorSubject<UserModel>;

  // current KYC graph step
  KYC_CURRENT_STEP: BehaviorSubject<string>;

  private static getItemParsed(str: string) {
    return JSON.parse(localStorage.getItem(str));
  }

  /**
   * Default value for localState
   */
  initState() {
    this.REDIRECT_AFTER_LOGIN = new BehaviorSubject<string>('/series/search');

    this.LOCALE = new BehaviorSubject<string>(
      StateService.getItemParsed('STATE_LOCALE') || 'fr'
    );

    this.TOKEN = new BehaviorSubject<TokenModel>(
      StateService.getItemParsed('STATE_TOKEN') || null
    );

    this.LOGGED_USER = new BehaviorSubject<UserModel>(
      StateService.getItemParsed('STATE_LOGGED_USER') || null
    );

    this.KYC_CURRENT_STEP = new BehaviorSubject<string>(
      StateService.getItemParsed('KYC_CURRENT_STEP') || null
    );
  }

  /**
   * trigger persist data when updated
   */
  private listenToStateChangesAndSave() {
    merge(
      this.LOCALE.pipe(mapTo('STATE_LOCALE')),
      this.TOKEN.pipe(mapTo('STATE_TOKEN')),
      this.LOGGED_USER.pipe(mapTo('STATE_LOGGED_USER')),
      this.KYC_CURRENT_STEP.pipe(mapTo('KYC_CURRENT_STEP')),
    ).subscribe(val => {
      this.persistanceInLocalDevice(val);
    });
  }

  /**
   * Persist data to localstorage
   */
  private async persistanceInLocalDevice(stateName = null) {
    const observableName = stateName.replace(/^(STATE_)/, '');

    localStorage.setItem(
      stateName,
      JSON.stringify(
        await this[observableName].pipe(take(1)).toPromise()
      )
    );
  }
}
