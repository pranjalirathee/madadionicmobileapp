import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { NgForm } from '@angular/forms';
import { ToastProvider } from '../../providers/toast/toast';
import { HttpProvider } from '../../providers/http/http';
import { LoadingProvider } from '../../providers/loading/loading';
import { RegistrationModel } from '../../models/registrationmodel';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  activeMenu: string="menu1";

  userid:string;
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
  
  ionViewWillEnter(){
   
   
  }
  
  submit(f:NgForm)
  {
   
      if(f.invalid)
      {
        this.toastProvider.presentToast("Please fill all the fields correctly.");

      }
      else
      {
        this.loadingProvider.presentLoadingDefault();

      this.httpProvider.getMethod("common/forgotPassword?userId="+this.userid)
      .subscribe((data) => 
      {

        console.log(data);

        let alert = this.alertCtrl.create({
          message: data.message,
          buttons: [
            {
              text: 'Dismiss',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            }
          ]
        });
        alert.present(); 
       /*if(data.code =="0")
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

       }*/
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
