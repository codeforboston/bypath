import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/mapHome/mapHome.html'
})
export class mapHome {

  constructor(private navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello Users Page')
    return (
      let myMap =  L.map('mapId').setView([51.505, -0.09], 13)
    )
  }

}
