'use strict';
angular.module('main')
.controller('DebugCtrl', function ($scope, $log, Main, Config, complainables, threeoneones, ThreeOneOne) {

  $log.log('Hello from your Controller: DebugCtrl in module main:. This is your controller:', this);

  // var bug = this;


  $scope.test = {};
  $scope.test.cases = [];
  ThreeOneOne.uniqueCases().then(function(data) {
    // $scope.cases = data;
    // $log.log('data', data.data);
    for (var i = 0; i < data.data.length; i ++) {
      var thing = {
        title: data.data[i].case_title,
        count: parseInt(data.data[i].count_case_title)
      };
      $scope.test.cases.push(thing);
      // $log.log(thing);
    };

    // angular.forEach(data, function (obj) {
    //   obj.count_int = parseInt(obj.count_case_title);
    // });
    // $scope.cases = data;
  })
  $log.log('$scope.cases', $scope.test.cases);


  // data: Array (1000)
  // 0{case_title: "Doherty Playground (Dot): Pathway repair to eliminate trip hazard"}
  // 1{case_title: "Park Maintenance: Arnold Arboretum"}
  // 2{case_title: "Graffiti Removal - paint bollard - Dist 3"}
  // 3{case_title: "Ground Maintenance: Martin Luther King Boulevard"}
  // 4{case_title: "Park Lighting Issue: Victory Garden"}
  // 5{case_title: "Graffiti Removal - paint control cabinet - Dist 4 (green paint)"}
  // 6{case_title: "Tot Lot: Flaherty Playground (Southie): Install PIP"}
  // 7{case_title: "Brophy park"}
  // 8{case_title: "Malcolm X Park"}
  // 9{case_title: "Street Light Outages/LAMP #N1347013 95 Selwyn /sent"}
  // 10{case_title: "Graffiti Removal - paint or power wash wall - Dist 2"}
  // 11{case_title: "Graffiti: Ward 18 1814"}
  // 12{case_title: "LAMP #NFA2284 Walnut Ave. @ Elmore St/ sent"}
  // 13{case_title: "Graffiti: Ward 20 2004 Other"}
  // 14{case_title: "George Wright Golf Course: Moldy ceiling tiles in bathroom"}
  // 15{case_title: "Graffiti: Ward 19 1911 Other"}
  // 16{case_title: "Request for Bollard Repair"}
  // 17{case_title: "outage/LAMP #N0983058 1884 River St./sent"}
  // 18{case_title: "Contractor Complaint D3 Dorchester"}
  // 19{case_title: "Union Park Street Play Area: Exposed concrete at tot-lot"}
  // 20{case_title: "Park Maintenance: Healy Playground"}
  // 21{case_title: "Park Maintenance: Columbia Road"}
  // 22{case_title: "Park Improvement: Hobart Park"}
  // 23{case_title: "Park Maintenace: Rose Garden"}
  // 24{case_title: "Park Maintenace: Billings Field"}
  // 25{case_title: "damaged bike rack"}
  // 26{case_title: "Graffiti Removal - power wash wall - Dist 10"}
  // 27{case_title: "Street Light Outages/LAMP #N3193001 59 Birchland Ave/sent"}
  // 28{case_title: "Graffiti: Ward 15 1502"}
  // 29{case_title: "Prescott Square"}
  // 30{case_title: "Street Light Outages/LAMP #N2341012 91 Clare Ave/sent"}
  // 31{case_title: "Weather Advisory"}
  // 32{case_title: "Hunt Almont Park"}
  // 33{case_title: "Park Maintenance: Marcella/Connolly Park"}
  // 34{case_title: "Park Maintenace: Cuneo Park"}
  // 35{case_title: "Street Light Outages/LAMP #N1326005 37 Ramsdell Ave/sent"}
  // 36{case_title: "Graffiti Removal - paint light box - dist 4"}
  // 37{case_title: "PublicWorks: Missed Trash D3 Dorchester"}
  // 38{case_title: "Ceylon Park: Artificial turf damage"}
  // 39{case_title: "Street Light Outages/DCR lights/reallocated"}
  // 40{case_title: "Repaint Fire Lane"}
  // 41{case_title: "KNOCKDOWN opp 401 Border and West Eagle Street E Boston"}
  // 42{case_title: "Fence:Ringer Playground: Imrie Rd. fence replacement"}
  // 43{case_title: "Graffiti Removal - paint contol cabinet _ Dist 2"}
  // 44{case_title: "Graffiti Removal - powr wsah metel ple - Dist 4"}
  // 45{case_title: "Pathway:Adams/King Playground: Asphalt Pathway Repair"}
  // 46{case_title: "Sidewalk Repair/Red-Brick/Dist 8"}
  // 47{case_title: "Graffiti Removal - Power Washing - bridge overpass - Dist 3"}
  // 48{case_title: "Park Maintenance: East Boston Greenway"}
  // 49{case_title: "Graffiti Removal - power wash white line - Dist 4"}
  // 50{case_title: "Graffiti: 13 1310 Other"}
  // 51{case_title: "Park Improvement: Camp Meigs"}
  // 52{case_title: "Contrator Complaint D8 Hyde Park"}
  // 53{case_title: "composite replacement pole needs arm and fixture/sent"}
  // 54{case_title: "Park Maintenance: Harvard Mall"}
  // 55{case_title: "Sinkhole"}
  // 56{case_title: "26 ELM HILL AVE LIGHT OUT"}
  // 57{case_title: "Graffiti: Ward 13 1309 Profane Text"}
  // 58{case_title: "Graffiti on home window sil - Dist 2"}
  // 59{case_title: "Walker Playground: PIP repair"}
  // 60{case_title: "Quincy Street Play Area"}
  // 61{case_title: "Park Maintenance: Cuneo Park"}
  // 62{case_title: "Graffiti: Ward 14 1408 Other"}
  // 63{case_title: "Eire-Ellington Park Fence issue (contractor fence?)"}
  // 64{case_title: "Equipment Repair: Lambert Ave. Playground"}
  // 65{case_title: "McConnell Park: Baseball field renovation"}
  // 66{case_title: "PRINTED ////"}
  // 67{case_title: "Graffiti Removal - paint sign - Dist 8"}
  // 68{case_title: "Graffiti: Ward 11 1110"}
  // 69{case_title: "Pavement Marking Lane Inspection"}
  // 70{case_title: "Graffiti: Ward 15 1507 Gang"}
  // 71{case_title: "Sidewalk Repair/Red Brick/Dist 2"}
  // 72{case_title: "Graffiti Removal - Dist 2"}
  // 73{case_title: "Street Light Outages (Contractor ranger found)"}
  // 74{case_title: "Damaged Street light pole"}
  // 75{case_title: "Graffiti Removal - paint black control box - Dist 4"}
  // 76{case_title: "graffiti on wall - Dist 4"}
  // 77{case_title: "Sidewalk Repair//Dist 3"}
  // 78{case_title: "ONS - Work w/out Permit"}
  // 79{case_title: "McLaughlin Playground: Install new drinking fountain"}
  // 80{case_title: "Graffiti: Ward 21 2113 Gang"}
  // 81{case_title: "Park Lighting Issue: ODay Playground"}
  // 82{case_title: "Park Maintenance: Tubman Square"}
  // 83{case_title: "Hynes Playground"}
  // 84{case_title: "Graffiti Removal - power wash s/walk"}
  // 85{case_title: "Graffiti: Ward 11 1103"}
  // 86{case_title: "Graffiti Removal - on litter basket? - Dist 2"}
  // 87{case_title: "Park Maintenace: Martin/Hilltop Playground"}
  // 88{case_title: "PRINTED KOED POLE @ #385 NEPONSET AVE"}
  // 89{case_title: "Street Light Outages //SENT TO MAVERICK///"}
  // 90{case_title: "McCarthy Playground Fence Repair"}
  // 91{case_title: "Street Light and Control box knockdown- Talbot and Blue Hill Avenue"}
  // 92{case_title: "Graffiti: Ward 16 1612 Gang"}
  // 93{case_title: "News Boxes - Reinspect Tue Jul 8"}
  // 94{case_title: "Billings Playground: Playground separation fence gate fell down"}
  // 95{case_title: "morton street at canterbury"}
  // 96{case_title: "Graffiti: Ward 10 1009 Profane Text"}
  // 97{case_title: "Other. water overflow from manhole"}
  // 98{case_title: "Graffitit Removal - Dist 8"}
  // 99{case_title: "Planting/Horticulture: Worcester Square"}
  // // bind data from services
  // this.someData = Main.someData;
  // this.ENV = Config.ENV;
  // this.BUILD = Config.BUILD;

  // // PASSWORD EXAMPLE
  // this.password = {
  //   input: '', // by user
  //   strength: ''
  // };
  // this.grade = function () {
  //   var size = this.password.input.length;
  //   if (size > 8) {
  //     this.password.strength = 'strong';
  //   } else if (size > 3) {
  //     this.password.strength = 'medium';
  //   } else {
  //     this.password.strength = 'weak';
  //   }
  // };
  // this.grade();

});
