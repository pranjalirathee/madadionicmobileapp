import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegistrationModel } from '../../models/registrationmodel';
import { NgForm } from '@angular/forms';
import { ToastProvider } from '../../providers/toast/toast';
import { HttpProvider } from '../../providers/http/http';
import { LoadingProvider } from '../../providers/loading/loading';
import { CheckotpPage } from '../checkotp/checkotp';

/**
 * Generated class for the UpdateProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update-profile',
  templateUrl: 'update-profile.html',
})
export class UpdateProfilePage {
  activeMenu: string="menu1";


  updateprofile=<RegistrationModel>{};
  username:string;
  fullname:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private alertCtrl: AlertController,private toastProvider:ToastProvider,
    public httpProvider:HttpProvider
    ,public loadingProvider :LoadingProvider,public events: Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdateProfilePage');
  }
  logout()
  {
   this.presentLogout();
  }
  
  ionViewWillEnter(){
   
    
    if(localStorage.getItem('username') == null ||
    localStorage.getItem('username') == undefined ||
    localStorage.getItem('username') == "")   
    {
    
      this.navCtrl.push(LoginPage);
     }

     else
    {
      this.username=localStorage.getItem('username');
      this.fullname=localStorage.getItem('fullname');
    }
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
            this.events.publish('user:menu',"false");

            this.navCtrl.push(LoginPage);

          }
        }
      ]
    });
    alert.present();
  }

  update(f:NgForm)
  {
    if(this.updateprofile.password != this.updateprofile.cpassword)
    {
     this.toastProvider.presentToast("Password and confirm password are different.");

    }
     else
     {
      if(f.invalid)
      {
        this.toastProvider.presentToast("Please fill all the fields correctly.");

      }
      else
      {
        this.loadingProvider.presentLoadingDefault();

      this.httpProvider.postMethod("user/passwordChange",{"password":this.updateprofile.password,"userName":this.username})
      .subscribe((data) => 
      {
       if(data.code =="0")
       {
        this.toastProvider.presentToast(data.message);
       
       }
       else
       {
        let alert = this.alertCtrl.create({
          message: 'Password changed successfully.',
          buttons: [
            {
              text: 'Dismiss',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
                this.navCtrl.push(LoginPage);
              }
            }
          ]
        });
        alert.present(); 

       }
      },err=> {
        console.log(err);
        
      this.toastProvider.presentToast("Some Error Occurred. Please Try Again.");
      
    },()=>
      {
        this.loadingProvider.dismissLoading();
      });

      }
     }
  }
}
