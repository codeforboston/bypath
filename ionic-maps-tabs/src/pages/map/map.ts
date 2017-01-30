import { Component, ViewChild, ElementRef } from '@angular/core'
import { Http } from '@angular/http'
import { NavController } from 'ionic-angular'
import { Geolocation } from 'ionic-native'
import 'rxjs/add/operator/map'

declare var google

@Component({
  selector: 'home-page',
  templateUrl: 'map.html'
})

export class MapPage {

  @ViewChild('map') mapElement: ElementRef

  map: any
  mapPoints: any

  constructor(public navCtrl: NavController, public http: Http) {

    //this.http.get('https://www.reddit.com/r/gifs/new/.json?limit=10').map(res => res.json()).subscribe(
    this.http.get('http://localhost:8080/incident/get?x=42&y=-71&d=1').map(res => res.json()).subscribe(
    //this.http.get('http://bypath.herokuapp.com/incident/get?x=42&y=-71&d=1').map(res => res.json()).subscribe(
      data => {
        this.mapPoints = data
        console.log(this.mapPoints)
      },
      err => {
        console.log('error!!! :)')
      }
    )
  }





  ionViewDidLoad()  {
    console.log("got to zero")
    this.loadMap()
  }





  loadMap(){
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

      this.mapPoints.forEach(function(point) {
        let latLong = new google.maps.LatLng(point.latitude, point.longitude)
        let marker = new google.maps.Marker({
          position: latLong,
          map: map
        })
        /*
        let content = "<h4>point.title  </h4>"
        this.addInfoWindow(marker, content)

        addInfoWindow(marker, content) {
          let infoWindow = new google.maps.InfoWindow({
            content: content
          })
          google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker)
          })
        }
        */
      })

    }), (err) => {
      console.log(err)
     }
  }
  //console.log("got to 2 ")
}






/*
const mapPoints = this.http.get('localhost:3000/incident/get?x=42&y=-71&d=1').map(res => res.json()).subscribe(data => {
   console.log(data)
})


const mapPoints = this.http.get('http://bypath-api.herokuapp.com/incident/get?x=42&y=-71&d=1').map(res => res.json()).subscribe(data => {
   console.log(data)
})

$http.get('facebook.com/allthecutecats', function(response){
  $scope.cats = response.data;
})
*/

/*
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
*/

/*
let marker = new google.maps.Marker({
  position: latLng,
  map: this.map,
  title: 'Hello World!'
})
*/
