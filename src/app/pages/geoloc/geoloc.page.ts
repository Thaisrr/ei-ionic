import { Component, OnInit } from '@angular/core';
import {Geolocation, Position} from '@capacitor/geolocation';

@Component({
  selector: 'app-geoloc',
  templateUrl: './geoloc.page.html',
  styleUrls: ['./geoloc.page.scss'],
})
export class GeolocPage implements OnInit {
  position: Position;
  updateCount = 0;

  constructor() { }

  ngOnInit() {
   this.getLocation();
  //  this.watchPosition();
  }

  async getLocation() {
    this.position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true
    });
    console.log(this.position);
  }

  async watchPosition() {
    await Geolocation.watchPosition({
      enableHighAccuracy: true,
      timeout: 10000
    },position => {
      console.log('Position updated');
      this.position = position;
      this.updateCount++;
    });
  }
}
