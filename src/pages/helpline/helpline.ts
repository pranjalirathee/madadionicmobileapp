import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { CallNumber } from '@ionic-native/call-number';

/**
 * Generated class for the HelplinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-helpline',
  templateUrl: 'helpline.html',
})
export class HelplinePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private callNumber: CallNumber) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelplinePage');
  }
  ionViewWillEnter(){
   
    if(localStorage.getItem('username') == null ||
    localStorage.getItem('username') == undefined ||
    localStorage.getItem('username') == "")   
    {
    
      this.navCtrl.push(LoginPage);
     }
  
  }

  logout()
{
  localStorage.setItem('username',"");
  this.navCtrl.push(LoginPage);
}

dialnumber(num)
  {
    this.callNumber.callNumber(num, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }
}
