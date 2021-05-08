import { IPagination } from './pagination';
import { ISong } from './song';

export interface IState {
  pagination?: IPagination;
  searchCriteria: string;
  songs: ISong[];
}
