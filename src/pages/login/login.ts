import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { LoginModel } from '../../models/LoginModel';
import { NgForm } from '@angular/forms';
import { ToastProvider } from '../../providers/toast/toast';
import { RegistrationModel } from '../../models/registrationmodel';
import { CheckotpPage } from '../checkotp/checkotp';
import { HttpProvider } from '../../providers/http/http';
import { HomePage } from '../home/home';

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
  msgFlag=false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastProvider:ToastProvider,public modalCtrl: ModalController,public httpProvider:HttpProvider) {
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
  
      this.httpProvider.postMethod("user/login",this.login).subscribe((data) => 
      {
       if(data.code =="0")
       {
        this.msgFlag=true;
       }
       else
       {
        this.msgFlag=false;
        localStorage.setItem('username',data.username);
        this.navCtrl.pop();

       }
      });
    }
  }

  registeruser(f:NgForm)
  {
    if(this.register.username == null || this.register.username =='')
    {
      this.toastProvider.presentToast("Please enter your name.");
    }
    else
    {
      if((this.register.uMobile == null || this.register.uMobile =='') &&
       (this.register.uEmail==null || this.register.uEmail ==''))
      {
        this.toastProvider.presentToast("Please enter either mobile number or email.");
   
      }

      else
      {

        if(f.invalid)
        {
          this.toastProvider.presentToast("Please fill all the fields correctly.");

        }
        else
        {
        this.httpProvider.postMethod("user/register",this.register).subscribe((data) => 
        {
         if(data.code =="0")
         {
          this.toastProvider.presentToast("Some Error Occurred. Please try again.");
         }
         else
         {
          this.register.rowId=data.rowId;
          let checkOtpModal = this.modalCtrl.create(CheckotpPage,this.register);
          checkOtpModal.present();
          checkOtpModal.onDidDismiss(data => {
              
              if(data != undefined)
              {
                
                
              }
              
        
        
            });
  
         }
        });

     
        }
      }
    }
  }

  numberonly(event) {
    let e = <KeyboardEvent> event;
      if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+C
        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+V
        (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+X
        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
          // let it happen, don't do anything
          return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
      
    }
}
