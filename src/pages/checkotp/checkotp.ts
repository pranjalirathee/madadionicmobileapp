import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

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

  otp:string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl:ViewController) {
      console.log(this.navParams);
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckotpPage');
  }

  checkotp(f:NgForm)
  {
    
  }

}
