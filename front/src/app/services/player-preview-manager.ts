import { Injectable } from '@angular/core';
import { PlayerPreview } from '../components/player-preview/player-preview';
import { forkJoin, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerPreviewManager {
  players: PlayerPreview[] = []

  registerPlayer(player: PlayerPreview) {
    this.players.push(player);
  }

  removePlayer(player: PlayerPreview) {
    this.players.splice(this.players.indexOf(player), 1);
  }

  pausePlayers() {
    return forkJoin(
      this.players.map(player => player.pauseVideo())
    ).pipe(map(() => void 0))
  }

  resumeLast(): Observable<void> {
    if (this.players.length === 0) {
      console.log('nothing to resume')
      return of(void 0)
    }

    const last = this.players.at(this.players.length - 1);

    if (!last) {
      return of(void 0)
    }


    return last.startVideo()
  }
}
