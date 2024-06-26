import { UpdateProfilePage } from './../update-profile/update-profile';
import { Component } from '@angular/core';
import { NavController, AlertController, Events, Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ComplaintStationPage } from '../complaint-station/complaint-station';
import { HttpProvider } from '../../providers/http/http';
import { ComplaintTrainPage } from '../complaint-train/complaint-train';
import { ComplaintTrackPage } from '../complaint-track/complaint-track';
import { ComplaintSuggestionPage } from '../complaint-suggestion/complaint-suggestion';
import { CallNumber } from '@ionic-native/call-number';
import { HelplinePage } from '../helpline/helpline';
import { FreightParcelPage } from '../freight-parcel/freight-parcel';
import {AppVersion} from '@ionic-native/app-version/';
import { text } from '@angular/core/src/render3/instructions';
import { HttpHeaders } from '@angular/common/http';
import { ComplaintRailAnubhavPage } from '../complaint-railanubhav/complaint-railanubhav';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  activeMenu: string="menu1";
   

  ionVersionNumber: string;
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
  complaintRailAnubhavPage:any=ComplaintRailAnubhavPage;
  helplinePage:any=HelplinePage;
  updateProfilePage:any=UpdateProfilePage;
  username:String;
  latestVersionNumber:string;



  tab1Root = ComplaintTrainPage;
  tab2Root = ComplaintStationPage;
  tab3Root = ComplaintTrackPage;
  tab4Root = ComplaintSuggestionPage;
  tab5Root=FreightParcelPage;
  tab6Root = ComplaintRailAnubhavPage;
  
  constructor(public navCtrl: NavController,private callNumber: CallNumber,public alertCtrl:AlertController,public httpProvider:HttpProvider,public events: Events,platform:Platform,
private appVersion:AppVersion,private theInAppBrowser: InAppBrowser
    ) {
platform.ready().then(async ()=>{
  this.checkversionIsUpdated(platform);

},err=> {
  console.log(err);
}
).catch(error => {
  alert(error);
});

}



  private checkversionIsUpdated(platform: Platform) {

    if (platform.is('cordova')) {
      this.getAppVersion().then((response) => {
        this.latestVersionNumber = response;

        this.appVersion.getVersionNumber().then(res => {

          this.ionVersionNumber = res;


          if (this.ionVersionNumber.localeCompare(this.latestVersionNumber, undefined, { numeric: true, sensitivity: 'base' }) === -1) {
            // alert(this.ionVersionNumber);
            this.theInAppBrowser.create("https://play.google.com/store/apps/details?id=cris.railmadad", "_system",{location:'no'});
          }
        }, err => {
          console.log(err);

        }
        ).catch(error => {
          alert(error);
        });



      }).catch((error) => {
        console.log(error);
      });
    }
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


 async getAppVersion(){
  var myHeaders = new HttpHeaders();
  myHeaders.set("Authorization", "Basic ZXh0ZXJuYWx1c2VyOm1AZEBkYWRtMW4=");
 let response=await this.httpProvider.getMethodWithOption("secure/AppVersion",{responseType:'text',headers:{"Authorization":"Basic ZXh0ZXJuYWx1c2VyOm1AZEBkYWRtMW4="}}).toPromise();

return response;

 }




}
