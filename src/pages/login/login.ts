import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { LoginModel } from '../../models/LoginModel';
import { NgForm } from '@angular/forms';
import { ToastProvider } from '../../providers/toast/toast';
import { RegistrationModel } from '../../models/registrationmodel';
import { CheckotpPage } from '../checkotp/checkotp';
import { HttpProvider } from '../../providers/http/http';
import { HomePage } from '../home/home';
import { LoadingProvider } from '../../providers/loading/loading';
import { UserSession } from '../../providers/usersession';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';

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
  regDet:String="";
  activeMenu: string="menu1";
  forgotPasswordPage:any=ForgotPasswordPage;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastProvider:ToastProvider,public modalCtrl: ModalController,public httpProvider:HttpProvider
    ,public loadingProvider :LoadingProvider,public userSession:UserSession, public events:Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.appType='Login';
  }
  ionViewWillEnter(){
   this.appType='Login';
   this.regDet="";

  }

  checklogin(f:NgForm)
  {
    if(f.invalid)
    {
      this.toastProvider.presentToast("Please enter the username and password.");
    }
    else
    {
      this.loadingProvider.presentLoadingDefault();

      this.httpProvider.postMethod("user/login",this.login).subscribe((data) => 
      {
       if(data.code =="0")
       {
        this.msgFlag=true;
       
        this.toastProvider.presentToast(data.message);
        localStorage.setItem('username',"");
        localStorage.setItem('fullname',"");
        localStorage.setItem('contact',"");
        localStorage.setItem('password',"");
        this.events.publish('user:menu',"false");
       }
       else
       {
        this.msgFlag=false;
        

        localStorage.setItem('username',data.username);
        localStorage.setItem('fullname',data.name);
        localStorage.setItem('contact',data.username);
        localStorage.setItem('password',this.login.upswd);
        this.events.publish('user:menu',"true");
        this.navCtrl.pop();

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

  registeruser(f:NgForm)
  {
    this.regDet="";

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
      else if(this.register.uMobile != null && this.register.uMobile !=''
     && this.register.uMobile.substring(0,1) !='9' && this.register.uMobile.substring(0,1) !='7'
      && this.register.uMobile.substring(0,1) !='8' && this.register.uMobile.substring(0,1) !='6')
     {
       this.toastProvider.presentToast("Please enter a valid mobile number.");
  
     }
    else if(this.register.password != this.register.cpassword)
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
          console.log(this.register);
          this.loadingProvider.presentLoadingDefault();

        this.httpProvider.postMethod("user/register",this.register).subscribe((data) => 
        {
         if(data.code =="0")
         {
          this.toastProvider.presentToast(data.message);
          this.regDet="";
         }
         else
         {
          this.register.rowId=data.rowId;
          let checkOtpModal = this.modalCtrl.create(CheckotpPage,this.register);
          checkOtpModal.present();
          checkOtpModal.onDidDismiss(data => {
              
              if(data != undefined)
              {
                this.regDet=data.msg;
                this.toastProvider.presentToast(data.msg);
                
              }
              
              f.resetForm();
        
            });
  
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
  pushNextPageWithoutLogin(page)
{
  this.navCtrl.push(page);


}
  public numberonly(event: any) {
    const pattern = /^[0-9]*$/;   
    
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9]/g, "");
  
    }
  
    if(event.target.value.length >10)
    {
      event.target.value=event.target.value.substring(0,10);
    }
  }
  
}
