import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SongsService } from 'src/app/_services/songs.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  value: string = ' ';
  constructor(private songsService: SongsService) {}

  ngOnInit(): void {
    this.value = this.songsService.getLatestSearchCriteria() ?? ' ';
  }

  onSubmit(form: NgForm) {
    const value = form.value.searchValue;
    this.songsService.loadSongs(value);
  }
}
