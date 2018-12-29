import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WatchService {

  private currentVideo = null;
  private currentTimecode = null;

  constructor() { }
}
