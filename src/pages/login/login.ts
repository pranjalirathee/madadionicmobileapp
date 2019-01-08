import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { LoginModel } from '../../models/LoginModel';
import { NgForm } from '@angular/forms';
import { ToastProvider } from '../../providers/toast/toast';
import { RegistrationModel } from '../../models/registrationmodel';
import { CheckotpPage } from '../checkotp/checkotp';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  appType = 'Login';
  login=<LoginModel>{};
  register=<RegistrationModel>{};

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastProvider:ToastProvider,public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.appType='Login';
  }
  ionViewWillEnter(){
   this.appType='Login';
  }

  checklogin(f:NgForm)
  {
    if(f.invalid)
    {
      this.toastProvider.presentToast("Please enter the username and password.");
    }
    else
    {

    }
  }

  registeruser(f:NgForm)
  {
    if(f.invalid)
    {
      this.toastProvider.presentToast("Please enter your name.");
    }
    else
    {
      if((this.register.mobile == null || this.register.mobile =='') &&
       (this.register.email==null || this.register.email ==''))
      {
        this.toastProvider.presentToast("Please enter either mobile number or email.");
   
      }

      else
      {
        var data=this.register;
        let checkOtpModal = this.modalCtrl.create(CheckotpPage,data);
        checkOtpModal.present();
        checkOtpModal.onDidDismiss(data => {
            
            if(data != undefined)
            {
              
              
            }
            
      
      
          });
      }
    }
  }

}
