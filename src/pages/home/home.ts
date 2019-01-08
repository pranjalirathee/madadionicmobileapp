import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ComplaintStationPage } from '../complaint-station/complaint-station';
import { HttpProvider } from '../../providers/http/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  loginPage:any=LoginPage;
  complaintStationPage:any=ComplaintStationPage;

  constructor(public navCtrl: NavController) {
  
  }

   
}
