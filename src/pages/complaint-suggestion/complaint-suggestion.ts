import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { StationNameProvider } from '../../providers/station-name/station-name';
import { WebcamInitError, WebcamImage, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { LoginPage } from '../login/login';
import { NgForm } from '@angular/forms';
import { ToastProvider } from '../../providers/toast/toast';
import { SuggestionModel } from '../../models/suggestionmodel';
import { LoadingProvider } from '../../providers/loading/loading';
import { SelectSearchableComponent } from 'ionic-select-searchable';


/**
 * Generated class for the ComplaintSuggestionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-complaint-suggestion',
  templateUrl: 'complaint-suggestion.html',
})
export class ComplaintSuggestionPage {
  activeMenu: string="menu1";

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
            this.navCtrl.push(LoginPage);

          }
        }
      ]
    });
    alert.present();
  }

  suggestionArr=[];
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
  trainArr=[];
  trainArrMod=[];
  trainArrGlobal=[];


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
  results:string[]=[];
  ref:string="";

  suggestionObj=<SuggestionModel>{};

  constructor(public navCtrl: NavController, public navParams: NavParams,public httpProvider:HttpProvider,
    private toastProvider:ToastProvider,public loadingProvider :LoadingProvider,public alertCtrl:AlertController) {
  }

  ngOnInit() { 
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComplaintSuggestionPage');
  }

  ionViewWillEnter(){
    this.getSuggestionList();
    this.getStationList();
    this.getTrainList();

    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
    
    var minusfivedays=new Date(Date.now() - tzoffset);
    minusfivedays.setDate(minusfivedays.getDate()-5);
    var minTime =minusfivedays.toISOString().slice(0,-1);
    if(localStorage.getItem('username') == null ||
    localStorage.getItem('username') == undefined ||
    localStorage.getItem('username') == "")   
    {
    
      this.navCtrl.push(LoginPage);
     }
     else
     {
       this.suggestionObj.contact=localStorage.getItem('contact');
       this.suggestionObj.name=localStorage.getItem('fullname');
     }
  
  }

  getSuggestionList()
  {
    //console.log('JSON: getSuggestionList')

    this.httpProvider.postMethod("user/suggestion", {}).subscribe((data) => 
    {
      //console.log('JSON: postMethod')
      if(data.data.length >0)
            {
                //console.log(JSON.stringify('JSON: ' + data.data))
                this.suggestionArr=data.data; 

            }
          else{
            console.log('JSON: Else')
                this.suggestionArr=[];
             

             }
    });
  }

  getStationList()
  {
    
    this.httpProvider.getMethod("common/StationList").subscribe((data) => 
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
    
    this.httpProvider.getMethod("common/TrainList").subscribe((data) => 
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


submitsuggestion(f:NgForm)
{
  if(f.invalid)
  {
    console.log('Submit: Inside-If');
    this.toastProvider.presentToast("Please enter all the mandatory fields.");
  }
  else
  {    if(this.suggestionObj.contact.indexOf("@") != -1)
  {
    this.suggestionObj.email=this.suggestionObj.contact;
  }
  else
  {
    this.suggestionObj.mobile=this.suggestionObj.contact;

  }

      this.suggestionObj.suggestionChannel='A';
      if(this.suggestionObj.jouneyType=='S'){
      this.suggestionObj.stationCode=(this.suggestionObj.stationName as any).station_name.split("-")[1];
      this.suggestionObj.stationName=(this.suggestionObj.stationName as any).station_name.split("-")[0];
      }
      if(this.suggestionObj.jouneyType=='T'){

        console.log(this.suggestionObj.trainName);
      this.suggestionObj.trainNo=(this.suggestionObj.trainName as any).train_name.split("-")[1];
      }

    console.log('Submit: Inside-Else');
    console.log('suggestionReferenceNo: '+JSON.stringify(this.suggestionObj));
    // console.log('suggestionId : ' +this.suggestionObj.suggestionId);
    // console.log('suggestionDesc : ' +this.suggestionObj. suggestionDesc);
    // console.log('jouneyType : ' +this.suggestionObj.jouneyType);
    // console.log('trainNo  : ' +this.suggestionObj.trainNo);
    // console.log('stationCode  : ' +this.suggestionObj.stationCode);
    // console.log('stationName   : ' +this.suggestionObj.stationName);
    // console.log('suggestionChannel   : ' +this.suggestionObj.suggestionChannel);
    // console.log('name   : ' +this.suggestionObj.name);
    // console.log('mobile   : ' +this.suggestionObj.mobile);
    // console.log('email   : ' +this.suggestionObj.email);
    // console.log('zoneCode   : ' +this.suggestionObj.zoneCode);
    // console.log('divisionCode    : ' +this.suggestionObj.divisionCode);
    // console.log('departmentCode   : ' +this.suggestionObj.departmentCode);
    // console.log('userGroupId    : ' +this.suggestionObj.userGroupId);
    // console.log('slaFlag    : ' +this.suggestionObj.slaFlag);
    // console.log('trainName    : ' +this.suggestionObj.trainName);
    this.loadingProvider.presentLoadingDefault();

    this.httpProvider.postMethod("complaint/suggestion",this.suggestionObj).subscribe((data) => 
    {
     
      if(data.code== "0")
            {
                console.log('Submit: Inside-Error');
                this.toastProvider.presentToast(data.message) ;

            }
          else{
               console.log('Submit: Inside-Success-Code: '+data.code);
               this.ref=data.suggestionReferenceNo;

               
                let alert = this.alertCtrl.create({
                  title: 'Your Suggestion has been registered.',
                 
                  buttons: ['Dismiss']
                });
                alert.present();
              
               f.resetForm();

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
