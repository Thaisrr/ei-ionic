import { Component, OnInit } from '@angular/core';
import {CameraService} from '../../utils/services/camera.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {
  photos;
  constructor(
    private cameraService: CameraService
  ) { }

  ngOnInit() {
    this.cameraService.loadPictures()
      .then(() => this.photos = this.cameraService.photos);
  }

  loadPictures() {
    this.photos = this.cameraService.photos;
  }

  takePicture() {
    this.cameraService.takePicture()
      .then(() => this.loadPictures());
  }

  choosePicture() {
    this.cameraService.chooseInGallery()
      .then(() => this.loadPictures());
  }

  chooseSource() {
    this.cameraService.chooseImageSource()
      .then(() => this.loadPictures());
  }

}
