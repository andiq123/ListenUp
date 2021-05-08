import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { IProgressReport } from 'src/app/_models/progressReport';
import { ISong } from 'src/app/_models/song';
import { PlayerService } from 'src/app/_services/player.service';
import { SignalrService } from 'src/app/_services/signalr.service';
import { SongsService } from 'src/app/_services/songs.service';
import { getTrimmedText } from '../../../utils/stringUtils';
import { saveAs } from 'file-saver';
import { AuthService } from 'src/app/_services/auth.service';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss'],
})
export class SongComponent implements OnInit, OnDestroy {
  @Input() song!: ISong;
  limitChars: number = 30;
  playing: boolean = false;
  progress: number = 0;
  loading: boolean = false;
  isAuthenticated = false;
  colorLoading: 'primary' | 'warn' = 'primary';
  @Input() isAddedToLibrary!: boolean;
  @Output() removedSongFromFav = new Subject();

  constructor(
    private playerService: PlayerService,
    private songsService: SongsService,
    private signalrService: SignalrService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.listenForAuthenticationChanges();
    this.listenForProgressFromServer();
    this.listenForPlayPauseEvent();

    //Set Current data song playing from chache if exists;
    const data = this.playerService.getCurrentPlayingSongData();
    if (data) {
      this.setPlayingState(data.songId, data.isPlaying);
    }
  }

  listenForAuthenticationChanges() {
    this.isAuthenticated = this.authService.getUserIfAuthenticated();
  }

  listenForPlayPauseEvent() {
    this.playerService.playPauseEvent.subscribe(
      (data: { songId: number; isPlaying: boolean }) => {
        this.progress = 0;
        this.setPlayingState(data.songId, data.isPlaying);
      }
    );
  }

  listenForProgressFromServer() {
    this.signalrService.progress.subscribe((progress: IProgressReport) => {
      if (this.song.id === progress.songId) {
        this.progress = progress.progressPercentage;
        this.colorLoading = 'warn';
        this.loading = true;
      }
    });
  }

  downloadSong() {
    const name = `${this.song.title} - ${this.song.name}.mp3`;
    this.snackBar.open('Downlading...', 'close', { duration: 2000 });
    if (this.song.bufferURL) {
      saveAs(this.song.bufferURL, name);
    } else {
      this.loadBuffer(false);
    }
  }

  loadBuffer(changeSong: boolean) {
    this.signalrService.AddMyselfToQueue(this.song.id);

    this.songsService.downloadSong(this.song).subscribe(
      (data: any) => {
        const downloadingClientState =
          data.type > 1 && data.type < 4 && data.loaded && data.total;
        const finishedState = data.type === 4;

        if (downloadingClientState) {
          this.colorLoading = 'primary';
          const clientProgress = Math.floor((data.loaded / data.total) * 100);
          this.progress = clientProgress;
        } else if (finishedState) {
          data = data.body;
          const song = new Blob([new Uint8Array(data, 0, data.byteLength)], {
            type: 'audio/mpeg',
          });
          const fileUrl = URL.createObjectURL(song);
          this.song.bufferURL = fileUrl;

          if (changeSong) {
            this.playerService.changeCurrentSong(this.song);
          } else {
            this.downloadSong();
          }

          this.signalrService.RemoveMyselfFromQueue(this.song.id);
          this.progress = 0;
          this.loading = false;
        }
      },
      (error) => {
        this.loading = false;
        this.progress = 0;
      }
    );
  }

  selectSongToPlay() {
    this.loading = true;
    if (!this.song.bufferURL) this.loadBuffer(true);
    else {
      this.playerService.changeCurrentSong(this.song);
      this.loading = false;
    }
  }

  getSongTitle() {
    return getTrimmedText(this.song.title, this.limitChars);
  }

  setPlayingState(id: number, playing: boolean) {
    if (this.song.id === id) this.playing = playing;
  }

  //Favorite songs
  removeSongFromFav() {
    this.songsService.removeSongFromFavorites(this.song).subscribe(
      (data) => {
        this.isAddedToLibrary = false;
        this.removedSongFromFav.next();
      },
      (e) => console.log(e)
    );
  }

  addSongToFav() {
    this.songsService.addSongToFav(this.song).subscribe(
      (data: any) => {
        this.isAddedToLibrary = true;
      },
      (e) => {
        if (e.error.message === 'This song is already in your library') {
          this.snackBar.open(e.error.message, 'close', { duration: 5000 });
          this.isAddedToLibrary = true;
        } else this.isAddedToLibrary = false;
      }
    );
  }

  cacheSong() {
    caches.open('info').then((cache) => {});
  }

  getCachedSong() {
    caches.open('info').then((cache) => {
      cache.keys();
    });
  }
}
