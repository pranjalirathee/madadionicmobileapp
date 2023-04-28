import { ForgotPasswordPage } from './../pages/forgot-password/forgot-password';
import { UserSession } from './../providers/usersession';
import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, AlertController, Nav, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {timer} from 'rxjs/observable/timer';
import { ServicesPage } from '../pages/services/services';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { UpdateProfilePage } from '../pages/update-profile/update-profile';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
  rootPage:any = HomePage;
  showSplash=false;
  username:String="";
  loginPage:any=LoginPage;

  forgotPasswordPage:any=ForgotPasswordPage;

  servicesPage:any=ServicesPage;


  updateProfilePage:any=UpdateProfilePage;


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
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private alertCtrl:AlertController,private menu: MenuController,public events: Events) {

      events.subscribe('user:menu', (menu) => {

        this.changemenu(menu);
      });


      events.subscribe('user:login', (menu) => {

        this.checksession();
      });



    if(localStorage.getItem('fullname') != null &&
   localStorage.getItem('fullname') != undefined &&
   localStorage.getItem('fullname') != "")   
   {
    this.username=localStorage.getItem('fullname');
    }
    else{
      this.username="";
    }
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      splashScreen.hide();
      statusBar.styleBlackTranslucent();
     //git push --verbose timer(5000).subscribe(()=>this.showSplash=false)

    });
  }
changemenu(menu:string) {
  console.log(menu);
  if(menu=="true")
  {
    this.username=localStorage.getItem('fullname');
  }
  else
  {
    this.username="";
  }
  console.log(this.username);

}

pushNextPageWithoutLogin(page)
{
  this.navCtrl.push(page);
  this.menu.close("menu1");


}
  pushNextPage(page)
  {

    if(this.username=="" && page != 'helplinePage' && page != 'forgotPasswordPage')
    {
      this.navCtrl.push(LoginPage);
    }
    else
    {
    this.navCtrl.push(page);
    }
    this.menu.close("menu1");
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

            //this.navCtrl.push(HomePage);
            this.menu.close("menu1");

          }
        }
      ]
    });
    alert.present();
  }
}

