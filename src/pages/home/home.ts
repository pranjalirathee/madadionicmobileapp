import { UpdateProfilePage } from './../update-profile/update-profile';
import { Component } from '@angular/core';
import { NavController, AlertController, Events } from 'ionic-angular';
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
  activeMenu: string="menu1";
  checksession()
  {
    if(localStorage.getItem('username') == null ||
   localStorage.getItem('username') == undefined ||
   localStorage.getItem('username') == "")   
   {
   this.navCtrl.push(LoginPage);
     //this.navCtrl.push(LoginPage);
    }

  }

  loginPage:any=LoginPage;
  complaintStationPage:any=ComplaintStationPage;
  complaintTrainPage:any=ComplaintTrainPage;
  complaintTrackPage:any=ComplaintTrackPage;
  complaintSuggestionPage:any=ComplaintSuggestionPage;
  helplinePage:any=HelplinePage;
  updateProfilePage:any=UpdateProfilePage;
  username:String;



  tab1Root = ComplaintTrainPage;
  tab2Root = ComplaintStationPage;
  tab3Root = ComplaintTrackPage;
  tab4Root = ComplaintSuggestionPage;



  constructor(public navCtrl: NavController,private callNumber: CallNumber,public alertCtrl:AlertController,public events: Events) {
  
  }


  ionViewWillEnter(){
   if(localStorage.getItem('fullname') != null &&
   localStorage.getItem('fullname') != undefined &&
   localStorage.getItem('fullname') != "")   
   {
    this.username=localStorage.getItem('fullname');
    }
    else{
      this.username="";
    }
  }
   
  pushPage(page)
  {
   
    this.navCtrl.push(page);
    
  }

  pushNextPage(page)
  {
    if(this.username=="" && page != 'helplinePage')
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
    this.presentLogout();
  }
  
  presentLogout() {
    let alert = this.alertCtrl.create({
      message: 'Do you want to Logout?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            localStorage.setItem('username',"");
            localStorage.setItem('fullname',"");
            this.events.publish('user:menu',"false");

          //  this.navCtrl.push(HomePage);

          }
        }
      ]
    });
    alert.present();
  }
  dialnumber(num)
  {
    this.callNumber.callNumber(num, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }
}
