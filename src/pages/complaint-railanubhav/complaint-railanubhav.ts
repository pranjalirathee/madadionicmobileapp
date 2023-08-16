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


  checksession()
  {
    this.events.publish('user:login',"true");


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



   // this.railanubhav.mobileNum = "7906305535";
   // this.railanubhav.experience = "Test experience";
   //  this.railanubhav.feedback = "Test feedback";

      this.loadingProvider.presentLoadingDefault();

      this.httpProvider.postMethod("secure/SubmitRailAnubhav",this.railanubhav).subscribe((data) =>
      {

        if(data.code== "404" || data.code== "")
              {

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
