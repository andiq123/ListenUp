import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISong } from '../_models/song';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SongsService {
  baseUrl = environment.baseUrl;
  songs: ISong[] = [];
  favSongs: ISong[] = [];
  favSongsChanged = new Subject<ISong[]>();
  loading = new Subject<boolean>();
  errorHappened = new Subject<string>();
  noFavSongs = new Subject();

  public songsChanged = new Subject<ISong[]>();

  constructor(private http: HttpClient) {}

  getSongs() {
    return this.songs.slice();
  }

  loadSongs(name: string) {
    this.songs = [];
    this.loading.next(true);
    this.songsUpdated(this.songs.slice());
    this.http
      .get<ISong[]>(this.baseUrl + 'songs' + '?name=' + name)
      .pipe()
      .subscribe(
        (songs: ISong[]) => {
          this.songs = songs;
          this.songsUpdated(this.songs.slice());
          this.loading.next(false);
        },
        (e) => {
          this.errorHappened.next(e.error);
          this.loading.next(false);
        }
      );
  }

  songsUpdated(songs: ISong[]) {
    this.songsChanged.next(songs);
  }

  downloadSong(song: ISong) {
    const data = {
      songName: song.name + '-' + song.title,
      link: song.downloadUrl,
      songId: song.id,
    };
    return this.http.post(this.baseUrl + 'songs', data, {
      responseType: 'arraybuffer',
      observe: 'events',
      reportProgress: true,
    });
  }

  addSongToFav(song: ISong) {
    return this.http.post(this.baseUrl + 'favsongs/add', song).pipe((data) => {
      this.favSongs.push(song);
      this.favSongsChanged.next(this.favSongs);
      return data;
    });
  }

  getMyFavSongs() {
    this.http
      .get<ISong[]>(this.baseUrl + 'favsongs/get')
      .pipe(
        tap((favSongs: ISong[]) => {
          this.favSongs = favSongs;
          this.favSongsChanged.next(this.favSongs);
        }),
        catchError((e) => {
          this.noFavSongs.next();
          return of(e);
        })
      )
      .subscribe();
  }

  removeSongFromFavorites(song: ISong) {
    const nameIdentifier = song.title + song.name;
    return this.http
      .post(this.baseUrl + 'favsongs/remove', { nameIdentifier })
      .pipe(
        tap((data) => {
          this.favSongs = this.favSongs.filter((x) => x !== song);
          if (this.favSongs.length === 0) this.noFavSongs.next();
          this.favSongsChanged.next(this.favSongs);
          return data;
        })
      );
  }
}
