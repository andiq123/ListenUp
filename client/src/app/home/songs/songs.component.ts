import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { ISong } from 'src/app/_models/song';
import { PlayerService } from 'src/app/_services/player.service';
import { SignalrService } from 'src/app/_services/signalr.service';
import { SongsService } from 'src/app/_services/songs.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss'],
})
export class SongsComponent implements OnInit, OnDestroy {
  @Input() getFavSongs!: boolean;
  @Output() noFavSongEvent = new Subject<string>();
  songs: ISong[] = [];
  error: string = '';
  loading: boolean = false;

  constructor(
    private songsService: SongsService,
    private signalrService: SignalrService
  ) {}
  ngOnDestroy(): void {
    this.signalrService.disconnectFromSignal();
  }

  ngOnInit(): void {
    // this.loadDebugSongs();
    this.signalrService.connectToSignal();

    if (this.getFavSongs) {
      this.loadFavSongs();
    } else {
      this.songs = this.songsService.getSongs();
    }

    this.listenForSongChanged();
    this.listenForLoadingStatus();
    this.listenForError();
  }

  listenForError() {
    this.songsService.errorHappened.subscribe((error: string) => {
      this.error = error;
    });
  }

  listenForLoadingStatus() {
    this.songsService.loading.subscribe((loading: boolean) => {
      this.loading = loading;
    });
  }

  listenForSongChanged() {
    this.songsService.songsChanged.subscribe((songs: ISong[]) => {
      this.songs = songs;
      this.error = '';
    });
  }

  loadFavSongs() {
    this.songs = [];
    this.songsService.favSongsChanged.subscribe((songs: ISong[]) => {
      this.songs = songs;
    });
    this.songsService.getMyFavSongs();
  }

  onRemovedSongFromFav() {}

  loadDebugSongs() {
    this.songs = [
      {
        id: 0,
        title: 'ОНА - ОНО',
        name: 'MORGENSHTERN',
        duration: '01:37',
        downloadUrl:
          'https://d4.hotplayer.ru/download/241906777d10b042b6eac223860ef924/-2001005059_61005059/293d13c681f0-4c45007f518b-a0c89844cfe/MORGENSHTERN%20-%20%D0%9E%D0%9D%D0%90%20-%20%D0%9E%D0%9D%D0%9E.mp3',
      },
      {
        id: 1,
        title: 'Cristal amp МОЁТ',
        name: 'MORGENSHTERN',
        duration: '02:17',
        downloadUrl:
          'https://d7.hotplayer.ru/download/241906777d10b042b6eac223860ef924/-2001346387_81346387/cf4fd445d170-1005aefa2f88d-121c8ed2c94/MORGENSHTERN%20-%20Cristal%20%26%20%D0%9C%D0%9E%D0%81%D0%A2.mp3',
      },
      {
        id: 2,
        title: 'Быстро',
        name: 'SLAVA MARLOW MORGENSHTERN',
        duration: '01:56',
        downloadUrl:
          'https://d9.hotplayer.ru/download/241906777d10b042b6eac223860ef924/-2001567972_76567972/79f096eac5c5-1048145a185-1a83c7387ca8/SLAVA%20MARLOW%2C%20MORGENSHTERN%20-%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%BE.mp3',
      },
    ];
  }
}
