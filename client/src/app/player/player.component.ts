import { Component, OnInit, ViewChild } from '@angular/core';
import { PlayerService } from '../_services/player.service';
import { getTrimmedText } from '../utils/stringUtils';
import { MatSliderChange } from '@angular/material/slider';
import { ISong } from '../_models/song';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  song!: ISong;
  volume: number = 0.4;
  audioPlayer: HTMLAudioElement = new Audio();
  playing: boolean = false;
  duration!: { min: string; sec: string };
  currentTime!: { min: string; sec: string };
  changeAbleTime: number = 0;
  changingTime: boolean = false;
  limitChars = 50;

  constructor(public playerService: PlayerService) {}

  ngOnInit(): void {
    // if (this.song) {
    //   this.initPlayer(this.song);
    //   this.audioPlayer.src = this.song.downloadUrl;
    // }

    this.playerService.songEvent.subscribe((song: ISong) => {
      if (this.song && this.song.id === song.id) {
        this.play();
      } else {
        this.initPlayer(song);
        this.audioPlayer.play();
      }
    });
  }

  initPlayer(song: ISong) {
    if (this.song) this.emitThisSongPlaying(false);
    this.changeSongUrl(song);
    this.changeSrcForPlayer();
    this.listenForEvents();
  }

  play() {
    if (this.playing) {
      this.emitThisSongPlaying(false);
      this.audioPlayer.pause();
    } else {
      this.emitThisSongPlaying(true);
      this.audioPlayer.play();
    }
  }

  changeSongUrl(song: ISong) {
    this.song = song;
  }

  changeSrcForPlayer() {
    this.audioPlayer.src = this.song.bufferURL
      ? this.song.bufferURL
      : this.song.downloadUrl;
  }

  changeVolume($event: MatSliderChange) {
    if ($event.value || $event.value === 0) {
      this.audioPlayer.volume = $event.value;
      this.volume = $event.value;
    }
  }

  changeSongTime($event: MatSliderChange) {
    if ($event.value) {
      this.audioPlayer.currentTime = $event.value;
      this.changingTime = false;
    }
  }

  setPlayinStateTrue() {
    this.playing = true;
    this.emitThisSongPlaying(true);
  }
  setPlayinStateFalse() {
    this.playing = false;
    this.emitThisSongPlaying(false);
  }

  listenForEvents() {
    this.playing = false;
    this.audioPlayer.volume = this.volume;
    this.audioPlayer.onplaying = () => {
      this.setPlayinStateTrue();
    };

    this.audioPlayer.onended = () => {
      this.setPlayinStateFalse();
    };

    this.audioPlayer.onpause = () => {
      this.setPlayinStateFalse();
    };

    this.audioPlayer.oncancel = () => {
      this.setPlayinStateFalse();
    };

    this.audioPlayer.oncanplay = () => {
      this.duration = this.getTimeFromSec(this.audioPlayer.duration);
    };

    this.audioPlayer.ontimeupdate = () => {
      if (!this.changingTime) {
        this.currentTime = this.getTimeFromSec(this.audioPlayer.currentTime);
        this.changeAbleTime = this.audioPlayer.currentTime;
      }
    };
  }

  getTimeFromSec(time: number) {
    var hr = Math.floor(time / 3600);
    var min = Math.floor((time - hr * 3600) / 60);
    var sec = Math.floor(time - hr * 3600 - min * 60);
    return {
      min: min < 10 ? '0' + min.toString() : min.toString(),
      sec: sec < 10 ? '0' + sec.toString() : sec.toString(),
    };
  }

  desactivateChanging() {
    this.changingTime = true;
  }

  getTrimmedText(text: string) {
    return getTrimmedText(text, this.limitChars);
  }

  emitThisSongPlaying(state: boolean) {
    this.playerService.onPlayPause(this.song.id, state);
  }
}
