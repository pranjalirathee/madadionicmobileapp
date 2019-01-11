import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

/**
 * Generated class for the ComplaintStationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-complaint-station',
  templateUrl: 'complaint-station.html',
})
export class ComplaintStationPage {
  complaintArr=[];
  subcomplaintArr=[];
  stationArr=[];

  stncomplaint=<StnComplaintModel>{};


  minDate:String;
  maxDate:String;


  results:string[]=[];


  myphoto:any;
  username:string;
  ref:string="";

  getImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
  
    this.camera.getPicture(options).then((imageData) => {
      this.myphoto = imageData;
    }, (err) => {
      console.log(err);
   
    });
  }
  takePhoto() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.myphoto = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }
 
  constructor(public navCtrl: NavController, public navParams: NavParams,public httpProvider:HttpProvider,
    public completeTestService: StationNameProvider,  private transfer: FileTransfer,
    private camera: Camera,private toastProvider:ToastProvider) {
   
  }

  ionViewWillEnter(){
    this.getComplaintList();
    this.getStationList();

    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
    
    var minusfivedays=new Date(Date.now() - tzoffset);
    minusfivedays.setDate(minusfivedays.getDate()-5);
    var minTime =minusfivedays.toISOString().slice(0,-1);
   
    this.stncomplaint.incident_date=localISOTime;
    this.minDate=minTime;
    this.maxDate=localISOTime;

  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComplaintStationPage');
  }

  getSubComplaintList()
  {
    this.httpProvider.getMethod("coms/ComsSubHeadList?Id="+this.stncomplaint.stn_head).subscribe((data) => 
    {
     
      if(data.length >0)
            {
                this.subcomplaintArr=data; 
            }
          else{
                this.subcomplaintArr=[];
                    

             }
    });
  }

  getComplaintList()
  {
    
    this.httpProvider.getMethod("coms/ComsHeadListById?Id=\"s\"").subscribe((data) => 
    {
     
      if(data.length >0)
            {
                this.complaintArr=data; 
            }
          else{
                this.complaintArr=[];
                    

             }
    });
  }


  getStationList()
  {
    
    this.httpProvider.getMethod("coms/StationList").subscribe((data) => 
    {
     
      if(data.length >0)
            {
                this.stationArr=data; 

            }
          else{
                this.stationArr=[];
             

             }
    });
  }


 

  search(event) {
       if(event.query != "")
    {
    this.results = this.stationArr.filter(
      station => station.station_name.toLowerCase().indexOf(event.query.toLowerCase()) != -1);
    }

    else
    {
      this.results=this.stationArr;
    }
   
      
  }
  handleDropdown(event) {
    //event.query = current value in input field
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


  submitcomplaint(f:NgForm)
  {
    if(f.invalid)
    {
      this.toastProvider.presentToast("Please enter all the mandatory fields.");
    }
    else
    {
      this.stncomplaint.stn_code=(this.stncomplaint.stn_name as any).station_cd;
      this.stncomplaint.stn_name=(this.stncomplaint.stn_name as any).station_name;

      this.httpProvider.postMethod("complaint/station",this.stncomplaint).subscribe((data) => 
      {
       
        if(data.code== "0")
              {
                  this.toastProvider.presentToast("Some Error Occurred. Please try again.") ;
  
              }
            else{
                 this.ref=data.complaintReferenceNo;
               
  
               }
      });
    }
  }
}
