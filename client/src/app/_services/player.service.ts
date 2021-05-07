import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ISong } from '../_models/song';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  public songEvent = new Subject<ISong>();
  public playPauseEvent = new Subject<{ songId: number; isPlaying: boolean }>();
  //copy of a current song playing for cache
  data!: { songId: number; isPlaying: boolean };

  constructor() {}

  changeCurrentSong(song: ISong) {
    this.songEvent.next(song);
  }

  onPlayPause(songId: number, isPlaying: boolean) {
    const data = { songId, isPlaying };
    this.data = data;
    this.playPauseEvent.next(data);
  }

  getCurrentPlayingSongData() {
    return this.data;
  }
}
