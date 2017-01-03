import { Component, ViewChild, ElementRef } from '@angular/core'
import { Http } from '@angular/http'
import { NavController } from 'ionic-angular'
import { Geolocation } from 'ionic-native'
import 'rxjs/add/operator/map'

const mapPoints = [
 {
  id: 2,
  opened: '2016-04-20T16:04:00.000Z',
  source: 'boston_311',
  title: 'Unsafe/Dangerous Conditions',
  address: '22 Kenilworth St  Roxbury  MA  02119',
  latitude: 42.3285,
  longitude: -71.0873
 },
 {
  id: 4,
  opened: "2016-04-20T14:46:00.000Z",
  source: "boston_311",
  title: "Unsafe/Dangerous Conditions",
  address: "35 Eastman St  Dorchester  MA  02125",
  latitude: 42.3204,
  longitude: -71.0641
 },
 {
  id: 6,
  opened: '2016-04-20T10:24:00.000Z',
  source: 'boston_311',
  title: 'Unsafe/Dangerous Conditions',
  address: 'INTERSECTION of Massachusetts Ave & Chester Park  Roxbury  MA',
  latitude: 42.3594,
  longitude: -71.0587
 }
]

declare var google

@Component({
  selector: 'home-page',
  templateUrl: 'map.html'
})

export class MapPage {

  @ViewChild('map') mapElement: ElementRef
    map: any

    constructor(public navCtrl: NavController, public http: Http) {
    }

    ionViewDidLoad(){
      console.log("got to zero")

    this.loadMap()
    }

    loadMap(){
      /*
      let mapPoints = this.http.get('localhost:3000/incident/get?x=42&y=-71&d=1').map(res => res.json()).subscribe(data => {
         console.log(data)
      })
      */

      Geolocation.getCurrentPosition().then((position) => {

        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)

        let mapOptions = {
          zoomControl: true,
          zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL,
            position: google.maps.ControlPosition.RIGHT
          },
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        let map = new google.maps.Map(this.mapElement.nativeElement, mapOptions)
        console.log("Got to 1")
      /*
        let marker = new google.maps.Marker({
          position: latLng,
          map: this.map,
          title: 'Hello World!'
        })
      */
        mapPoints.forEach(function(point) {

          let latLong = new google.maps.LatLng(point.latitude, point.longitude)

          let marker = new google.maps.Marker({
            position: latLong,
            map: map,
            // icon: icon,
            title: point.title
          })
        })
      }, (err) => {
        console.log(err)
      })

      console.log("got to 2 ")

    }
}
