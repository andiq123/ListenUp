import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISong } from '../_models/song';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IPagination } from '../_models/pagination';
import { IState } from '../_models/state';

@Injectable({
  providedIn: 'root',
})
export class SongsService {
  baseUrl = environment.baseUrl;
  favSongs: ISong[] = [];
  favSongsChanged = new Subject<ISong[]>();
  loading = new Subject<boolean>();
  errorHappened = new Subject<string>();
  noFavSongs = new Subject();
  searchCriteria!: string;
  states: IState[] = [];
  firstRun = true;

  public songsChanged = new Subject<ISong[]>();
  public paginationChanged = new Subject<IPagination>();

  constructor(private http: HttpClient) {
    localStorage.removeItem('state');
  }

  getLatestSearchCriteria(): string {
    const stateFromCache = localStorage.getItem('state');
    if (stateFromCache) {
      const states = <IState[]>JSON.parse(stateFromCache);
      const lastState = states[states.length - 1];
      if (lastState.pagination)
        this.paginationChanged.next(lastState.pagination);
      if (lastState.searchCriteria) return lastState.searchCriteria;
      return '';
    }
    return '';
  }

  getSongs() {
    const stateFromCache = localStorage.getItem('state');
    if (stateFromCache) {
      const states = <IState[]>JSON.parse(stateFromCache);
      const lastState = states[states.length - 1];
      this.paginationChanged.next(lastState.pagination);
      return lastState.songs;
    }
    return [];
  }

  loadSongs(name: string = this.searchCriteria, pageNumber: number = 1) {
    const stateFromCache = localStorage.getItem('state');
    if (stateFromCache) {
      const states = <IState[]>JSON.parse(stateFromCache);
      const currentState = states.find(
        (x) =>
          x.pagination?.CurrentPage == pageNumber && x.searchCriteria == name
      );
      if (currentState) {
        this.paginationChanged.next(currentState.pagination);
        return this.songsUpdated(currentState.songs);
      }
    }
    if (name && name !== undefined) {
      this.searchCriteria = name;
      this.loading.next(true);
      this.http
        .get<ISong[]>(
          this.baseUrl + 'songs' + '?name=' + name + '&page=' + pageNumber,
          {
            observe: 'response',
          }
        )
        .pipe()
        .subscribe(
          (data: HttpResponse<ISong[]>) => {
            let pagination = data.headers.get('Pagination');
            if (pagination) {
              const paginationObject = <IPagination>JSON.parse(pagination);
              this.paginationChanged.next(paginationObject);
            }
            const songs = <ISong[]>data.body;
            const state: IState = {
              pagination: <IPagination>JSON.parse(pagination!),
              searchCriteria: name,
              songs: songs,
            };
            this.states.push(state);
            localStorage.setItem('state', JSON.stringify(this.states));
            this.songsUpdated(songs);
            this.loading.next(false);
          },
          (e) => {
            this.errorHappened.next(e.error);
            this.loading.next(false);
          }
        );
    }
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
    return this.http.post(this.baseUrl + 'songs/download', data, {
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
    if (this.favSongs.length > 0) {
      return this.favSongsChanged.next(this.favSongs);
    }
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
        }),
        catchError((e) => {
          this.favSongs = this.favSongs.filter((x) => x !== song);
          return of(e);
        })
      );
  }
}
