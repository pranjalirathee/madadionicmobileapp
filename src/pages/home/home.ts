import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ComplaintStationPage } from '../complaint-station/complaint-station';
import { HttpProvider } from '../../providers/http/http';
import { ComplaintTrainPage } from '../complaint-train/complaint-train';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  loginPage:any=LoginPage;
  complaintStationPage:any=ComplaintStationPage;
  complaintTrainPage:any=ComplaintTrainPage;
  username:String;

  constructor(public navCtrl: NavController) {
  
  }


  ionViewWillEnter(){
   if(localStorage.getItem('username') != null &&
   localStorage.getItem('username') != undefined &&
   localStorage.getItem('username') != "")   
   {
    this.username=localStorage.getItem('username');
    }
    else{
      this.username="";
    }
  }
   
}
