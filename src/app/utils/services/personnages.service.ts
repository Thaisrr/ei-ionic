import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {Personnage} from '../models/personnage';
import {HttpClient} from '@angular/common/http';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {MessageService} from './message.service';

@Injectable({
  providedIn: 'root'
})
export class PersonnagesService {
  api = 'https://swapi.dev/api/people';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getAll(): Observable<Personnage[]> {
    console.log('Coucou from perso service');
    return this.http.get<any>(this.api)
      .pipe(
        tap(() => {
          this.messageService.createToast(`Données chargées`);
        }),
        map(data => data.results ),
        catchError(err => {
          this.messageService.createToast(`Oups, quelque chose s'est mal passé`, 'danger');
          console.error(err);
          return of(undefined);
        })
      );
  }
}
