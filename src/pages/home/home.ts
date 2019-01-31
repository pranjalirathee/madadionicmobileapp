import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ComplaintStationPage } from '../complaint-station/complaint-station';
import { HttpProvider } from '../../providers/http/http';
import { ComplaintTrainPage } from '../complaint-train/complaint-train';
import { ComplaintTrackPage } from '../complaint-track/complaint-track';
import { ComplaintSuggestionPage } from '../complaint-suggestion/complaint-suggestion';
import { CallNumber } from '@ionic-native/call-number';
import { HelplinePage } from '../helpline/helpline';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  loginPage:any=LoginPage;
  complaintStationPage:any=ComplaintStationPage;
  complaintTrainPage:any=ComplaintTrainPage;
  complaintTrackPage:any=ComplaintTrackPage;
  complaintSuggestionPage:any=ComplaintSuggestionPage;
  helplinePage:any=HelplinePage;
  username:String;

  constructor(public navCtrl: NavController,private callNumber: CallNumber) {
  
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
   

  pushNextPage(page)
  {
    if(this.username=="")
    {
      this.navCtrl.push(LoginPage);
    }
    else
    {
    this.navCtrl.push(page);
    }
  }

  
  logout()
  {
    localStorage.setItem('username',"");
    this.navCtrl.push(LoginPage);
  }

  dialnumber()
  {
    this.callNumber.callNumber("9717630982", true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }
}
