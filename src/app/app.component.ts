import { UserSession } from './../providers/usersession';
import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, AlertController, Nav, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {timer} from 'rxjs/observable/timer';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { UpdateProfilePage } from '../pages/update-profile/update-profile';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
  rootPage:any = HomePage;
  showSplash=true;
  username:String="";
  loginPage:any=LoginPage;
  updateProfilePage:any=UpdateProfilePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private alertCtrl:AlertController,private menu: MenuController,public events: Events) {

      events.subscribe('user:menu', (menu) => {

        this.changemenu(menu);
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
      statusBar.styleDefault();
      timer(5000).subscribe(()=>this.showSplash=false)

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

            this.navCtrl.push(LoginPage);
            this.menu.close("menu1");

          }
        }
      ]
    });
    alert.present();
  }
}

