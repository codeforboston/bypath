import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

declare var google;

@Component({
  selector: 'home-page',
  templateUrl: 'map.html'
})

export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
    map: any;

    constructor(public navCtrl: NavController) {

    }

    ionViewDidLoad(){
      console.log("got to zero")
      this.loadMap();
    }

    loadMap(){

      Geolocation.getCurrentPosition().then((position) => {

        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)

        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions)
        console.log("Got to 1")
      }, (err) => {
        console.log(err);
      })
      console.log("got to 2 ")
    }
}
