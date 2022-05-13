import { Component, OnInit } from '@angular/core';
import {PersonnagesService} from '../../utils/services/personnages.service';
import {Personnage} from '../../utils/models/personnage';
import {Observable} from 'rxjs';
import {filter, find, map} from "rxjs/operators";

@Component({
  selector: 'app-personnages',
  templateUrl: './personnages.page.html',
  styleUrls: ['./personnages.page.scss'],
})
export class PersonnagesPage implements OnInit {

  personnages: Personnage[];
  displayed: Personnage[];
  search = '';

  constructor(
    private persoService: PersonnagesService
  ) { }

  ngOnInit() {
    this.persoService.getAll()
      .subscribe(perso => {
        this.personnages = perso;
        this.displayed = perso;
      });
    //this.personnages$ = this.persoService.getAll();
  }

  filterArray() {
    if(!this.search) {
      this.displayed = this.personnages;
    } else {
      this.displayed = this.personnages.filter(p => p.name.toLowerCase().includes(this.search.toLowerCase().trim()));
    }
  }
}
