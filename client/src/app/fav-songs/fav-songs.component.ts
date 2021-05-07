import { Component, OnInit } from '@angular/core';

import { SongsService } from '../_services/songs.service';

@Component({
  selector: 'app-fav-songs',
  templateUrl: './fav-songs.component.html',
  styleUrls: ['./fav-songs.component.scss'],
})
export class FavSongsComponent implements OnInit {
  error!: string;
  constructor(private songsService: SongsService) {}

  ngOnInit(): void {
    this.songsService.noFavSongs.subscribe(
      () => (this.error = 'You have not added any song here yet...')
    );
  }

  setError($event: any) {
    this.error = $event;
  }
}
