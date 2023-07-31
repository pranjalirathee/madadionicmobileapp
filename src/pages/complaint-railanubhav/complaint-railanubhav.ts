import { StationConditionModel } from './../../models/stationconditionmodel';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { StationNameProvider } from '../../providers/station-name/station-name';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file';
import { StarRatingModule } from 'ionic3-star-rating';

import { CameraOptions, Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { StnComplaintModel } from '../../models/stncomplaintmodel';
import { LoginPage } from '../login/login';
import { NgForm } from '@angular/forms';
import { ToastProvider } from '../../providers/toast/toast';
import { LoadingProvider } from '../../providers/loading/loading';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { FileEntry } from '@ionic-native/file';
import { RailAnubhavModel } from '../../models/railanubhavmodel';

/**
 * Generated class for the ComplaintStationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-complaint-railanubhav',
  templateUrl: 'complaint-railanubhav.html',
})
export class ComplaintRailAnubhavPage {
  rating: string = "0";

  activeMenu: string="menu1";
    isTrain = false;
  complaintArr=[];
  positiveAspectsArr=[];
  subcomplaintArr=[];
  stationArr=[];
  trainArr=[];
  trainArrMod=[];
  trainArrGlobal=[];

    //trainOrStationArr=[];
  stationArrMod=[];
  stationArrGlobal=[];
  stationcondition=<StationConditionModel>{};
  
  checksession()
  {
    this.events.publish('user:login',"true");


  }

  getconditions()
  {
    var stationcondition=new StationConditionModel();
    stationcondition.platformFlag="1";
    stationcondition.stationFlag="0";
    stationcondition.stallFlag="2";
    stationcondition.counterFlag="2";
    stationcondition.pnrTrnFlag="2";
    stationcondition.prrFlag="2";
    stationcondition.regMobileFlag="2";
    stationcondition.transactionIdFlag="2";
    this.httpProvider.getMethod("common/stationcondition?subComplaint="+this.stncomplaint.subComplaint).subscribe(
      (data)=>
      {
        console.log(data);
        if(data.error==false)
        {
          console.log("tsse");
          stationcondition=data;
        }
        
    var arr=["platform","station","stall","counter","pnrTrn","prr","regMobile","transactionId"];
    arr.forEach(element => {

      switch (stationcondition[element+"Flag"])
      {
        case "0":
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
      }
    );

    


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
      
      title: 'Thank you for sharing your experience, Your experience is saved successfully!',

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

//---------------------------- Search Station 

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







//---------------------------- Search Train 

searchTrain(event: {
  component: SelectSearchableComponent,
  text: string
}) {
  let text = event.text.trim().toLowerCase();

  if (text != '') {
    event.component.startSearch();
   
    this.trainArr = this.trainArrGlobal.filter(
      train => (train.train_name.toLowerCase().indexOf(text.toLowerCase()) != -1
      || train.train_no.toLowerCase().indexOf(text.toLowerCase()) != -1));
      this.trainArrMod=[];
      var maxlen = (15>(this.trainArr.length)) ? this.trainArr.length : 15;
      if(maxlen>0){
     
      for(var i=0;i<maxlen;i++)
      {
        this.trainArrMod.push({'train_name':(this.trainArr[i] as any).train_name+':-'+(this.trainArr[i] as any).train_no});
      }
    }
    event.component.items = this.trainArrMod;

    event.component.endSearch();
   
    
  }
  else
  {
    event.component.startSearch();
    this.trainArrMod=[];
    var maxlen = (15>(this.trainArrGlobal.length)) ? this.trainArrGlobal.length : 15;
    if(maxlen>0){
    

    for(var i=0;i<maxlen;i++)
    {
      this.trainArrMod.push({'train_name':(this.trainArrGlobal[i] as any).train_name+':-'+(this.trainArrGlobal[i] as any).train_no});

    }
  }
    event.component.endSearch();

  }
 


}
getMoreTrains(event: {
  component: SelectSearchableComponent,
  text: string
}) {
 
  if(this.trainArrMod.length != this.trainArr.length)
  {
    var lennew=this.trainArrMod.length;
    var maxlen = (15>(this.trainArr.length-lennew)) ? (this.trainArr.length-lennew) : 15;
   
    for(var i=lennew;i<lennew+maxlen;i++)
    {
      this.trainArrMod.push({'train_name':(this.trainArr[i] as any).train_name+':-'+(this.trainArr[i] as any).train_no});
    }
    event.component.items = this.trainArrMod;
    event.component.endInfiniteScroll();
  }
  else{
    event.component.disableInfiniteScroll();
    return;
  }

}
trainChange(event: {
  component: SelectSearchableComponent,
  value: any 
}) {
  console.log('port:', event.value);
}












  stncomplaint=<StnComplaintModel>{};


  railanubhav=<RailAnubhavModel>{};


  results:string[]=[];


  username:string;
  ref:string="";

  // getImage() {
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
  //     saveToPhotoAlbum:false,
  //     encodingType:this.camera.EncodingType.PNG,
  //     mediaType:this.camera.MediaType.ALLMEDIA
  //   }
  //   this.camera.getPicture(options).then((imageData) => {
  //     var data=imageData;
  //     if(!data.includes('file://')) 
  //     {
  //     data = 'file://' + data; }
  //      this.file.resolveLocalFilesystemUrl(data).then((entry: FileEntry) => 
  //      { //alert( entry); 
  //     });


  //     this.myphoto = 'data:image/jpeg;base64,' + imageData;
     
  //   }, (err) => {
  //     console.log(err);
   
  //   });
  // }
  // takePhoto() {
  //   const options: CameraOptions = {
  //     quality: 70,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE
  //   }

  //   this.camera.getPicture(options).then((imageData) => {
  //     // imageData is either a base64 encoded string or a file URI
  //     // If it's base64:
  //     this.myphoto = 'data:image/jpeg;base64,' + imageData;
  //   }, (err) => {
  //     // Handle error
  //   });
  // }
 
  constructor(public navCtrl: NavController, public navParams: NavParams,public httpProvider:HttpProvider,
    public completeTestService: StationNameProvider,  private transfer: FileTransfer,
    private camera: Camera,private toastProvider:ToastProvider,public loadingProvider :LoadingProvider,
    private alertCtrl: AlertController,private file:File,public events: Events) {
      events.subscribe('star-rating:changed', (starRating) => {
        console.log(starRating);
        this.rating = starRating;
        this.railanubhav.feedback = starRating;
      });
  }


  resetdet()
  {
    
    this.getPositiveAspects();

    this.rating = "0";
  
  }

  ionViewWillEnter(){
   

    this.resetdet();

  }

  getItemFromLocalStorage()
  {
    if(localStorage.getItem('username') == null ||
    localStorage.getItem('username') == undefined ||
    localStorage.getItem('username') == "")   
    {
        console.log("---------------inisde localStorage");
     // this.navCtrl.push(LoginPage);
     }

     else
    {
      this.railanubhav.mobileNum=localStorage.getItem('contact');
      //this.stncomplaint.complainantName=localStorage.getItem('fullname');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComplaintStationPage');
  }

  getTrainOrStationList()
  {
    if(this.railanubhav.mode=='T')
    {
      this.getTrainList();
      this.isTrain = true;
    }
   else
   {
    this.getStationList();
    this.isTrain = false;

   }
  }

  // getComplaintList()
  // {
    
  //   this.httpProvider.getMethod("common/HeadListById?Id=\"s\"").subscribe((data) => 
  //   {
     
  //     if(data.length >0)
  //           {
  //               this.complaintArr=data; 
  //           }
  //         else{
  //               this.complaintArr=[];
                    

  //            }
  //   });
  // }


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


  getTrainList()
  {

    this.httpProvider.getMethod("secure/TrainList").subscribe((data) =>
    {

      if(data.length >0)
            {

                this.trainArr=data;
                this.trainArrGlobal=data;
                this.trainArrMod=[];
                var maxlen = (15>(this.trainArr.length)) ? this.trainArr.length : 15;
                if(maxlen>0){
                for(var i=0;i<maxlen;i++)
                {
                  this.trainArrMod.push({'train_name':(this.trainArr[i] as any).train_name+':-'+(this.trainArr[i] as any).train_no});
                }
              }

            }
          else{
                this.trainArr=[];


             }
    });
  }



  
  getPositiveAspects()
  {

          console.log("-----------" + this.rating);

    this.httpProvider.getMethod("secure/PositiveAspects").subscribe((data) => 
    {
      console.log("inside getPositiveAspects");

      if(data.length >0)
      {
        console.log("iniside iffffffff");
          this.positiveAspectsArr=data; 
      }
    else{
          this.positiveAspectsArr=[];
              

       }
    });
  }



 

  search(event) {
    if(this.railanubhav.mode == "S")
    {
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

    else{
         
    if(event.query != "")
    {
    this.results = this.trainArr.filter(
      train => (train.train_no.toLowerCase().indexOf(event.query.toLowerCase()) != -1
      || train.train_name.toLowerCase().indexOf(event.query.toLowerCase()) != -1));
    }

    else
    {
      this.results=this.trainArr;
    }
   
 
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
    if(f.invalid || this.rating == "0")
    {
      this.toastProvider.presentToast("Please enter all the mandatory fields.");
    }
    else
    {
      this.getItemFromLocalStorage();
      if(this.railanubhav.mode=='S')
      {
      this.railanubhav.trainorstation=(this.railanubhav.trainorstation as any).station_name.split("-")[0];
      console.log("---------------------- station" + this.railanubhav.trainorstation);
      }

      else
      {
        this.railanubhav.trainorstation =(this.railanubhav.trainorstation as any).train_name.split(':-')[1];
        console.log("---------------------- train" + this.railanubhav.trainorstation);
      }
      this.railanubhav.feedback = this.rating;
           console.log("----------------------inside else  submitcomplaint mobile" + this.railanubhav.mobileNum);
           console.log("----------------------inside else  submitcomplaint experience" + this.railanubhav.experience);
           console.log("----------------------inside else  submitcomplaint feedback" + this.railanubhav.feedback);
           console.log("----------------------inside else  submitcomplaint rating" + this.rating);


   // this.railanubhav.mobileNum = "7906305535";
   // this.railanubhav.experience = "Test experience";
   //  this.railanubhav.feedback = "Test feedback";

      this.loadingProvider.presentLoadingDefault();

      this.httpProvider.postMethod("secure/SubmitRailAnubhav",this.railanubhav).subscribe((data) => 
      {        console.log("----------------------here " + data.code);

        if(data.code== "404" || data.code== "")
              {
                      console.log("----------------------here " + data.message);
                  this.toastProvider.presentToast(data.message) ;
  
              }
            else{
                //  this.ref=data.complaintReferenceNo;
                 // this.toastProvider.presentToast("Your experience is saved successfully") ;
                //  var tempstation={"station_name":this.stncomplaint.stationName+"-"+this.stncomplaint.stationCode}
                //  this.stncomplaint.stationName=tempstation as any;
               
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
