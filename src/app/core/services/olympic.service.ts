import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ChartOlympicsData, OlympicsData } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private jsonUrl = 'assets/mock/olympic.json';

  constructor(private http: HttpClient) {}

  getOlympics(): Observable<OlympicsData[]> {
    return this.http.get<OlympicsData[]>(this.jsonUrl)
  }

  

}
