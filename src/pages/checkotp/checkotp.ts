import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { ToastProvider } from '../../providers/toast/toast';
import { HttpProvider } from '../../providers/http/http';
import { LoadingProvider } from '../../providers/loading/loading';

/**
 * Generated class for the CheckotpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkotp',
  templateUrl: 'checkotp.html',
})
export class CheckotpPage {
  activeMenu: string="menu1";

  otp:string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl:ViewController, public toastProvider:ToastProvider,
    public httpProvider:HttpProvider
    ,public loadingProvider :LoadingProvider) {
      console.log(this.navParams.data.rowId);
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckotpPage');
  }

  checkotp(f:NgForm)
  {

    if(f.invalid)
    {
      this.toastProvider.presentToast("Please enter OTP.");
    }
    else
    {
    var json="{\"row_id\": \""+this.navParams.data.rowId+"\" ,\"otp\":\""+this.otp+"\"}";
    console.log(json);
    this.loadingProvider.presentLoadingDefault();

    this.httpProvider.postMethod("secureuser/otp",JSON.parse(json)).subscribe((data) =>
    {
     if(data.code =="0")
     {
      this.toastProvider.presentToast("Invalid OTP");

     }
     else
     {
      let sdata = { 'msg': 'Thank you for registering in COMS Portal. Your Login Id is: '+this.navParams.data.username+' and Password is : '+this.navParams.data.password +'.'};
      this.viewCtrl.dismiss(sdata);

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
