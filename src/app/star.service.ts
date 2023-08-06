import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StarService {
  private _votedRating: number = 0;

  get votedRating(): number {
    return this._votedRating;
  }

  set votedRating(value: number) {
    this._votedRating = value;
  }
  constructor() { }
}
