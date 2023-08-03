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
import { UserSession } from '../../providers/usersession';

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
  activeAccToRefNo=false;                                             //changes
  valid=true;
  trackcomplaint=<TrackComplaintModel>{};
  complaintdetail=<ComplaintDetail>{};
  complaintHistory:any[]=[];
  ref:string="";



  checksession()
  {
    this.events.publish('user:login',"true");
//alert("check session called");
    //this.ionViewDidLoad();


  }
  constructor(public navCtrl: NavController,
    public navParams: NavParams,public httpProvider:HttpProvider,public loadingProvider :LoadingProvider,
    private toastProvider:ToastProvider,public alertCtrl:AlertController,public events: Events,public service: UserSession) {
  }
  ngOnInit() {
    this.service.getValue().subscribe((value) => {

      if(value==true){
        this.setComplaintHistory();
      }
      else{
        this.complaintHistory=[];
        this.activeAccToRefNo=false;
        this.trackcomplaint.complaintReferenceNo=null;

      }
    });
  }
  ionViewWillEnter() {
    //this.complaintHistory=[];
    this.activeAccToRefNo=false;
    this.trackcomplaint.complaintReferenceNo=null;
    console.log('ionViewWillEnter ComplaintTrackPage');
    if(localStorage.getItem('username') == null ||
    localStorage.getItem('username') == undefined ||
    localStorage.getItem('username') == "")
    {

     // this.navCtrl.push(LoginPage);
     this.complaintHistory=[];
     }
else{
  this.setComplaintHistory();
}




  }
  setComplaintHistory(){

      this.trackcomplaint.userName=localStorage.getItem('username');
      if(this.trackcomplaint.userName.indexOf("@")!=-1)
      {
        this.trackcomplaint.userType="E";
      }
      else
      {
       this.trackcomplaint.userType="M";
      }
      this.httpProvider.postMethod("secureuser/complainthistory",this.trackcomplaint).subscribe((data) =>
      {
              console.log(JSON.stringify(data));
             data.forEach(element => {
               var temp=element.incidentDate.split(" ");
               var date=temp[0].split("-");
               var time=temp[1].split(":");
               console.log(date[2]+"/"+date[1]+"/"+date[0]+" "+time[0]+":"+time[1]);
             });
            this.complaintHistory=data;

      },err=> {
        console.log(err);

      this.toastProvider.presentToast("Some Error Occurred. Please Try Again.");

    });

  }

  ionViewCanEnter(){
  //  console.log("-------------------ionViewCanEnter ComplaintTrackPage------------");                        //changes
    if(localStorage.getItem('username') == null ||
    localStorage.getItem('username') == undefined ||
    localStorage.getItem('username') == "")
    {

     // this.navCtrl.push(LoginPage);
     }



     else {
     this.trackcomplaint.userName=localStorage.getItem('username');
     if(this.trackcomplaint.userName.indexOf("@")!=-1)
     {
       this.trackcomplaint.userType="E";
     }
     else
     {
      this.trackcomplaint.userType="M";
     }
     this.httpProvider.postMethod("secureuser/complainthistory",this.trackcomplaint).subscribe((data) =>
     {
     // console.log("-----------------data of track complaint within ionViewCanEnter--------------"+JSON.stringify(data));
             console.log(JSON.stringify(data));
            data.forEach(element => {
     //         console.log("----------------incident date original---------"+element.incidentDate);
              var temp=element.incidentDate.split(" ");
              var date=temp[0].split("-");
              var time=temp[1].split(":");
              console.log(date[2]+"/"+date[1]+"/"+date[0]+" "+time[0]+":"+time[1]);
            });
           this.complaintHistory=data;
     //      console.log("-----------print statement 2 within ionViewCanEnter-------------"+this.complaintHistory);
     },err=> {
       console.log(err);

     this.toastProvider.presentToast("Some Error Occurred. Please Try Again.");

   });
  }



  }
  callfunction(){
    alert("hello");
  }

  numericOnly(event): boolean {
    let pattern = /^([0-9])$/;
    let result = pattern.test(event.key);
  //  console.log("--------------result--------"+result);
    return result;
 }

  presentConfirm(ref,f,valid) {


    let alert = this.alertCtrl.create({

      title: valid ? 'Please enter your reference number':'Please enter valid reference number',

     // subTitle: 'If you want to register another complaint,press yes or else press no',
       buttons: [
        {
          text: 'Close',
          role: 'cancel',
          handler: () => {
            f.resetForm();
           // this.resetdet();
          }

        }
      ]
    });
    alert.present();
  }

  submittrack(f:NgForm)
  {
  //  console.log("---------------------complaint reference no-----------"+this.trackcomplaint.complaintReferenceNo);
    if(this.trackcomplaint.complaintReferenceNo !=null && this.trackcomplaint.complaintReferenceNo !="")
    {
      if( this.trackcomplaint.complaintReferenceNo.length!=13){
        this.valid=false;
        this.presentConfirm(this.ref,f,this.valid);
      }
      else{
      this.loadingProvider.presentLoadingDefault();
      this.trackcomplaint.userName=localStorage.getItem('username');
      this.httpProvider.postMethod("secure/helpline_tracking",this.trackcomplaint).subscribe((data) =>
      {


// for (var i = 0; i < data.length; i++) {
//   this.complaintDetailsArr.push(data['account'+i]);

              //this.complaintDetailsArr
              // console.log("--------------------inside submit fetching data of track complaint ref no wise------------"+JSON.stringify(data));
              // console.log("--------------------date code------------"+data.code);

              if(data.code!='1')
              {
                this.activeAccToRefNo = false;
                this.toastProvider.presentToast("No Record Found");
              }

              else{
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
              this.activeAccToRefNo = true;
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
    // else if( this.trackcomplaint.complaintReferenceNo.length!=13){


    // }
    else{
      this.activeAccToRefNo=false;
      this.valid=true;
       this.presentConfirm(this.ref,f,this.valid);
     }

  //  this.activeAccToRefNo = true;                                                  //changes

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
