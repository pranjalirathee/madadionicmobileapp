import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { StationNameProvider } from '../../providers/station-name/station-name';
import { WebcamInitError, WebcamImage, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { StnComplaintModel } from '../../models/stncomplaintmodel';
import { LoginPage } from '../login/login';
import { NgForm } from '@angular/forms';
import { ToastProvider } from '../../providers/toast/toast';
import { TrackComplaintModel } from '../../models/trackcomplaintmodel';
import { ComplaintDetail} from '../../dto/complaintdetail';
import { LoadingProvider } from '../../providers/loading/loading';

/**
 * Generated class for the ComplaintTrackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-complaint-track',
  templateUrl: 'complaint-track.html',
})
export class ComplaintTrackPage {
  activeMenu: string="menu1";

  trackcomplaint=<TrackComplaintModel>{};
  complaintdetail=<ComplaintDetail>{};
  complaintHistory:any[]=[];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,public httpProvider:HttpProvider,public loadingProvider :LoadingProvider,
    private toastProvider:ToastProvider,public alertCtrl:AlertController,public events: Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComplaintTrackPage');
  }

  ionViewCanEnter(){
    if(localStorage.getItem('username') == null ||
    localStorage.getItem('username') == undefined ||
    localStorage.getItem('username') == "")   
    {
    
      this.navCtrl.push(LoginPage);
     }




     this.trackcomplaint.userName=localStorage.getItem('username');
     if(this.trackcomplaint.userName.indexOf("@")!=-1)
     {
       this.trackcomplaint.userType="E";
     }
     else
     {
      this.trackcomplaint.userType="M";
     }
     this.httpProvider.postMethod("user/complainthistory",this.trackcomplaint).subscribe((data) => 
     {
             console.log(JSON.stringify(data));
            
           this.complaintHistory=data;

     },err=> {
       console.log(err);
       
     this.toastProvider.presentToast("Some Error Occurred. Please Try Again.");
     
   });
  }

  submittrack(f:NgForm)
  { 
    if(this.trackcomplaint.complaintReferenceNo !=null)
    {
      this.loadingProvider.presentLoadingDefault();
      this.trackcomplaint.userName=localStorage.getItem('username');
      this.httpProvider.postMethod("user/tracking",this.trackcomplaint).subscribe((data) => 
      {

              
// for (var i = 0; i < data.length; i++) {
//   this.complaintDetailsArr.push(data['account'+i]);

              //this.complaintDetailsArr
              console.log(JSON.stringify(data));
              if(data.code!='1')
              {
                this.toastProvider.presentToast("No Record Found");
              }
              this.complaintdetail.responsecode=data.code;
              this.complaintdetail.complaintReferenceNo=data.complaintReferenceNo;
              this.complaintdetail.complaintType=data.complaint;
              this.complaintdetail.complaintSubType=data.subComplaint;
              this.complaintdetail.incidentDate=data.incidentDate;
              this.complaintdetail.department=data.department;
              this.complaintdetail.division=data.division;
              this.complaintdetail.zone=data.zone;
              this.complaintdetail.remark=data.remark;
              this.complaintdetail.status=data.status;
              this.complaintdetail.pending_closed_by=data.userGroupId;
 
      },err=> {
        console.log(err);
        
      this.toastProvider.presentToast("Some Error Occurred. Please Try Again.");
      
    },()=>
      {
        this.loadingProvider.dismissLoading();
      });
    
    }
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
            this.events.publish('user:menu',"false");

            this.navCtrl.push(LoginPage);

          }
        }
      ]
    });
    alert.present();
  }
}
