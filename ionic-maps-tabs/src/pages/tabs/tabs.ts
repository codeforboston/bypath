import { Component } from '@angular/core';

import { MapPage } from '../map/map';
import { AboutPage } from '../about/about';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page

  tab1Root: any = AboutPage;
  tab2Root: any = MapPage;

  constructor() {

  }
}
