import {Component} from '@angular/core';
import {mapHome} from '../mapHome/mapHome';
import {AboutPage} from '../about/about';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  private tab1Root: any;
  private tab2Root: any;
  
  constructor() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = AboutPage;
    this.tab2Root = mapHome;
  }
}
