import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { StationNameProvider } from '../../providers/station-name/station-name';

import { CameraOptions, Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { StnComplaintModel } from '../../models/stncomplaintmodel';
import { LoginPage } from '../login/login';
import { NgForm } from '@angular/forms';
import { ToastProvider } from '../../providers/toast/toast';
import { LoadingProvider } from '../../providers/loading/loading';
import { SelectSearchableComponent } from 'ionic-select-searchable';

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
  stationArrMod=[];
  stationArrGlobal=[];


  searchStation(event: {
    component: SelectSearchableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();

    if (text != '') {
      event.component.startSearch();
   
      this.stationArr = this.stationArrGlobal.filter(
        station => (station.station_name.toLowerCase().indexOf(text.toLowerCase()) != -1
        || station.station_cd.toLowerCase().indexOf(text.toLowerCase()) != -1));
        this.stationArrMod=[];
        var maxlen = (15>(this.stationArr.length)) ? this.stationArr.length : 15;
        if(maxlen>0){
       
        for(var i=0;i<maxlen;i++)
        {
          this.stationArrMod.push({'station_name':(this.stationArr[i] as any).station_name+'-'+(this.stationArr[i] as any).station_cd});
        }
      }
      event.component.items = this.stationArrMod;

      event.component.endSearch();
     
      
    }
    else
    {
      event.component.startSearch();
      this.stationArrMod=[];
      var maxlen = (15>(this.stationArrGlobal.length)) ? this.stationArrGlobal.length : 15;
      if(maxlen>0){
      

      for(var i=0;i<maxlen;i++)
      {
        this.stationArrMod.push({'station_name':(this.stationArrGlobal[i] as any).station_name+'-'+(this.stationArrGlobal[i] as any).station_cd});

      }
    }
      event.component.endSearch();

    }
   


  }
  getMoreStations(event: {
    component: SelectSearchableComponent,
    text: string
  }) {
   
    if(this.stationArrMod.length != this.stationArr.length)
    {
      var lennew=this.stationArrMod.length;
      var maxlen = (15>(this.stationArr.length-lennew)) ? (this.stationArr.length-lennew) : 15;
     
      for(var i=lennew;i<lennew+maxlen;i++)
      {
        this.stationArrMod.push({'station_name':(this.stationArr[i] as any).station_name+'-'+(this.stationArr[i] as any).station_cd});
      }
      event.component.items = this.stationArrMod;
      event.component.endInfiniteScroll();
    }
    else{
      event.component.disableInfiniteScroll();
      return;
    }

  }
  stationChange(event: {
    component: SelectSearchableComponent,
    value: any 
}) {
    console.log('port:', event.value);
}
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
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      saveToPhotoAlbum:false,
      encodingType:this.camera.EncodingType.PNG,
      mediaType:0
    }
  
    this.camera.getPicture(options).then((imageData) => {
      this.myphoto = 'data:image/jpeg;base64,' + imageData;
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
    private camera: Camera,private toastProvider:ToastProvider,public loadingProvider :LoadingProvider) {
   
  }


  resetdet()
  {
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
    this.myphoto="";
  }

  ionViewWillEnter(){
   
    this.resetdet();
    if(localStorage.getItem('username') == null ||
    localStorage.getItem('username') == undefined ||
    localStorage.getItem('username') == "")   
    {
    
      this.navCtrl.push(LoginPage);
     }
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
                this.stationArrGlobal=data;
                this.stationArrMod=[];
                var maxlen = (15>(this.stationArr.length)) ? this.stationArr.length : 15;
                if(maxlen>0){
                for(var i=0;i<maxlen;i++)
                {
                  this.stationArrMod.push({'station_name':(this.stationArr[i] as any).station_name+'-'+(this.stationArr[i] as any).station_cd});
                }
              }

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
      station => (station.station_name.toLowerCase().indexOf(event.query.toLowerCase()) != -1
      || station.station_cd.toLowerCase().indexOf(event.query.toLowerCase()) != -1));
    }

    else
    {
      this.results=this.stationArr;
    }
   
      
  }
  handleDropdown(event) {
    //event.query = current value in input field
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


  submitcomplaint(f:NgForm)
  {
    if(f.invalid)
    {
      this.toastProvider.presentToast("Please enter all the mandatory fields.");
    }
    else
    {
     console.log(this.stncomplaint.stn_name);
      this.stncomplaint.stn_code=(this.stncomplaint.stn_name as any).station_name.split("-")[1];
      this.stncomplaint.stn_name=(this.stncomplaint.stn_name as any).station_name.split("-")[0];
      this.stncomplaint.stn_ufile=this.myphoto;
      this.loadingProvider.presentLoadingDefault();

      this.httpProvider.postMethod("complaint/station",this.stncomplaint).subscribe((data) => 
      {
        if(data.code== "0" || data.code== "")
              {
                  this.toastProvider.presentToast("Some Error Occurred. Please try again.") ;
  
              }
            else{
                 this.ref=data.complaintReferenceNo;
                 this.toastProvider.presentToast("Your complaint has been registered with Reference Number: "+this.ref+".") ;

                 f.resetForm();
                 this.resetdet();

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


  logout()
  {
    localStorage.setItem('username',"");
    this.navCtrl.push(LoginPage);
  }
}
