import { Component, OnInit } from '@angular/core';
import Swiper, { EffectCube, Navigation, Pagination, SwiperOptions} from 'swiper';

@Component({
  selector: 'app-swipe',
  templateUrl: './swipe.page.html',
  styleUrls: ['./swipe.page.scss'],
})
export class SwipePage implements OnInit {
  config: SwiperOptions = {
    effect: 'cube',
    navigation: true,
    pagination: true,
    grabCursor: true
  };

  constructor() { }

  ngOnInit() {
    Swiper.use([EffectCube, Navigation, Pagination]);
  }

}
