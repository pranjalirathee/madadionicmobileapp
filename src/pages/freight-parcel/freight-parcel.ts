import { StationConditionModel } from './../../models/stationconditionmodel';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { StationNameProvider } from '../../providers/station-name/station-name';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file';

import { CameraOptions, Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { StnComplaintModel } from '../../models/stncomplaintmodel';
import { LoginPage } from '../login/login';
import { NgForm } from '@angular/forms';
import { ToastProvider } from '../../providers/toast/toast';
import { LoadingProvider } from '../../providers/loading/loading';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { FileEntry } from '@ionic-native/file';

/**
 * Generated class for the FreightParcelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-freight-parcel',
  templateUrl: 'freight-parcel.html',
})
export class FreightParcelPage {
  activeMenu: string="menu1";

  complaintArr=[];
  subcomplaintArr=[];
  stationArr=[];
  stationArrMod=[];
  stationArrGlobal=[];
  stationcondition=<StationConditionModel>{};
  commodityArr=[];
  checksession()
  {
    this.events.publish('user:login',"true");


  }

  getconditions()
  {
    console.log("inside condition get"+this.stncomplaint.complaint)
    var stationcondition=new StationConditionModel();
    stationcondition.platformFlag="1";
    stationcondition.stationFlag="0";
    stationcondition.stallFlag="2";
    stationcondition.counterFlag="2";
    stationcondition.pnrTrnFlag="2";
    stationcondition.prrFlag="2";
    stationcondition.regMobileFlag="2";
    stationcondition.transactionIdFlag="2";
    stationcondition.fromStationFlag="2";
    stationcondition.toStationFlag="2";
    stationcondition.approxVolumeFlag="2";
    stationcondition.commodityFlag="2";
    stationcondition.freightParcelFlag="2";
    stationcondition.pnrUtsFlag="2";
    if(this.stncomplaint.complaint!=null){
    this.httpProvider.getMethod("secure/stationcondition?subHeadId="+this.stncomplaint.subComplaint).subscribe(
      (data)=>
      {
        console.log(data);
        if(data.error==false)
        {
          console.log("tsse");
          stationcondition=data;
        }

    var arr=["fromStation","toStation","approxVolume","commodity"];
    arr.forEach(element => {

      switch (stationcondition[element+"Flag"])
      {
        case "0":
          console.log(element+"showFlag");
        this.stationcondition[element+"showFlag"]=true;
        this.stationcondition[element+"reqFlag"]=true;
        break;
        case "1":
        this.stationcondition[element+"showFlag"]=true;
        this.stationcondition[element+"reqFlag"]=false;
        break;
        case "2":
        this.stationcondition[element+"showFlag"]=false;
        this.stationcondition[element+"reqFlag"]=false;
        break;
      }

    });
    if(this.stationcondition.commodityshowFlag==true){
      this.getCommodityList();
 }
      }

    );
    }



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

  presentConfirm(ref,f) {


    let alert = this.alertCtrl.create({

      title: 'Your complaint is registered; your complaint reference number is '+ref+'',

     // subTitle: 'If you want to register another complaint,press yes or else press no',
       buttons: [
        {
          text: 'Close',
          role: 'cancel',
          handler: () => {
            f.resetForm();
            this.resetdet();
          }

        }
      ]
    });
    alert.present();
  }
  prioritystationsearch(text):any[]{
    var topcode={};
    var codearr=[];
    var namearr=[];
    var finalarr=[];

    this.stationArrGlobal.forEach(element => {
      if(element.station_cd.toLowerCase()==text.toLowerCase())
      {
        topcode=element;
      }
      else if(element.station_cd.toLowerCase().indexOf(text.toLowerCase())==0)
      {
      codearr.push(element);
      }
      else{
      var names=element.station_name.toLowerCase().split(" ");
      var flag=false;
      names.forEach(name=>
        {
          if(name.indexOf(text.toLowerCase())==0)
          {
            flag=true;
          }
        });
        if(flag)
        {
      namearr.push(element);
        }
      }
    });
    if((topcode as any).station_name != undefined && (topcode as any).station_cd != undefined)
    {
      finalarr.push(topcode);
    }
    codearr.forEach(function(codeitem){
       finalarr.push(codeitem);
    });

    namearr.forEach(function(nameitem){
       finalarr.push(nameitem);
    });
    return finalarr;
}
  searchStation(event: {
    component: SelectSearchableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();

    if (text != '') {
      event.component.startSearch();

      this.stationArr =this.prioritystationsearch(text);
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
      mediaType:this.camera.MediaType.ALLMEDIA
    }
    this.camera.getPicture(options).then((imageData) => {
      var data=imageData;
      if(!data.includes('file://'))
      {
      data = 'file://' + data; }
       this.file.resolveLocalFilesystemUrl(data).then((entry: FileEntry) =>
       { //alert( entry);
      });


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
    private camera: Camera,private toastProvider:ToastProvider,public loadingProvider :LoadingProvider,
    private alertCtrl: AlertController,private file:File,public events: Events) {

  }


  resetdet()
  {
    this.getComplaintList();
    this.getStationList();
    this.resetShowAndReqFlag();
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);

    var minusfivedays=new Date(Date.now() - tzoffset);
    minusfivedays.setDate(minusfivedays.getDate()-5);
    var minTime =minusfivedays.toISOString().slice(0,-1);

    this.stncomplaint.incidentDate=localISOTime;
    this.minDate=minTime;
    this.maxDate=localISOTime;
    this.myphoto="";


  }
  resetShowAndReqFlag(){

    this.stationcondition.fromStationshowFlag=false;
    this.stationcondition.fromStationreqFlag=false;
    this.stationcondition.toStationshowFlag=false;
    this.stationcondition.toStationreqFlag=false;
    this.stationcondition.approxVolumeshowFlag=false;
    this.stationcondition.approxVolumereqFlag=false;
    this.stationcondition.commodityshowFlag=false;
    this.stationcondition.commodityreqFlag=false;

  }

  ionViewWillEnter(){
    this.resetShowAndReqFlag();

    this.resetdet();

  }
  setItemsFromLocalStorage(){
    if(localStorage.getItem('username') == null ||
    localStorage.getItem('username') == undefined ||
    localStorage.getItem('username') == "")
    {

     // this.navCtrl.push(LoginPage);
     }

     else
    {
      this.stncomplaint.contact=localStorage.getItem('contact');
      this.stncomplaint.complainantName=localStorage.getItem('fullname');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComplaintStationPage');
  }

  getSubComplaintList()
  {
    console.log("complaint value is..."+this.stncomplaint.complaint);
    if(this.stncomplaint.complaint=='14')
    {
      alert("For faster redressal of grievance, kindly choose miscellaneous category only if your complaint does not fall in any of the categories mentioned above.");
    }
    if(this.stncomplaint.complaint=='8'||
    this.stncomplaint.complaint=='10'||
    this.stncomplaint.complaint=='11')
    {
      var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds

    var minusfivedays=new Date(Date.now() - tzoffset);
    minusfivedays.setDate(minusfivedays.getDate()-600);
    var minTime =minusfivedays.toISOString().slice(0,-1);

    this.minDate=minTime;
    }
    this.httpProvider.getMethod("secure/SecureSubHeadList?parentId="+this.stncomplaint.complaint+"&&inquiryFlag=1").subscribe((data) =>
    {
      if(data.length >0 && this.stncomplaint.complaint != null)
            {
                this.subcomplaintArr=data;
                this.stncomplaint.subComplaint=data[0].id;
                this.getconditions();
            }
          else{
                this.subcomplaintArr=[];


             }
    });
  }

  getComplaintList()
  {
    this.stncomplaint.complaint=null;
    this.httpProvider.getMethod("secure/SecureHeadList?Id=\"s\"&&inquiryFlag=1").subscribe((data) =>
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
  getCommodityList()
  { console.log("inside commodity array"+this.stncomplaint.complaint);

    this.httpProvider.getMethod("secure/SecureCommodityList?headId="+this.stncomplaint.complaint).subscribe((data) =>
    {

      if( data!=null&&data.length >0)
            {
                this.commodityArr=data;


            }
          else{
                this.commodityArr=[];


             }
    });
  }

  getStationList()
  {

    this.httpProvider.getMethod("secure/StationList").subscribe((data) =>
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
    this.setItemsFromLocalStorage();
    if(f.invalid)
    {
      this.toastProvider.presentToast("Please enter all the mandatory fields.");
    }
    else
    {
      this.stncomplaint.channelType='A';
      this.stncomplaint.place_type='s';
      if(this.stncomplaint.contact.indexOf("@") != -1)
      {
        this.stncomplaint.complainantEmail=this.stncomplaint.contact;
      }
      else
      {
        this.stncomplaint.complainantMobile=this.stncomplaint.contact;

      }

      if(this.stncomplaint.fromStation != undefined)
      {
      this.stncomplaint.fromStation=(this.stncomplaint.fromStation as any).station_name.split("-")[1];

      }
      if(this.stncomplaint.toStation != undefined)
      {
      this.stncomplaint.toStation=(this.stncomplaint.toStation as any).station_name.split("-")[1];

      }
      this.stncomplaint.image=this.myphoto;
      this.loadingProvider.presentLoadingDefault();

      this.httpProvider.postMethod("secure/RegisterComplaint",this.stncomplaint).subscribe((data) =>
      {
        if(data.code== "0" || data.code== "")
              {
                  this.toastProvider.presentToast(data.message) ;

              }
            else{
                 this.ref=data.complaintReferenceNo;
                 //this.toastProvider.presentToast("Your complaint has been registered with Reference Number: "+this.ref+".") ;
                 var tempstation={"station_name":this.stncomplaint.stationName+"-"+this.stncomplaint.stationCode}
                 this.stncomplaint.stationName=tempstation as any;

                this.presentConfirm(this.ref,f);
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
   this.presentLogout();
  }

}
