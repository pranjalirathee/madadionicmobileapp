import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { StationNameProvider } from '../../providers/station-name/station-name';
import { WebcamInitError, WebcamImage, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { TrainComplaintModel } from '../../models/traincomplaintmodel';
import { ToastProvider } from '../../providers/toast/toast';
import { NgForm } from '@angular/forms';
import { ComplaintModel } from '../../models/complaintmodel';
import { LoginPage } from '../login/login';
import { LoadingProvider } from '../../providers/loading/loading';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { HomePage } from '../home/home';

/**
 * Generated class for the ComplaintTrainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-complaint-train',
  templateUrl: 'complaint-train.html',
})
export class ComplaintTrainPage {
  activeMenu: string="menu1";

  complaintArr=[];
  subcomplaintArr=[];
  trainArr=[];

  trainArrMod=[];
  trainArrGlobal=[];


  presentConfirm(ref,f) {
    let alert = this.alertCtrl.create({
      title: 'Your complaint is successfully registered and your complaint ref. no. is :'+ref+'',

      subTitle: 'Do you want to register more complaint, If yes press yes else no',
    
      buttons: [
        {
          text: 'Yes',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'No',
          handler: () => {
            console.log('Buy clicked');
            f.resetForm();
            this.resetdet();
            this.navCtrl.push(HomePage);

          }
        }
      ]
    });
    alert.present();
  }
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
  berthArr=[];
  coachArr=[];

  trncomplaint=<ComplaintModel>{};


  minDate:String;
  maxDate:String;


  results:string[]=[];


  myphoto:any="";
  pnrFlag=false;
  ref:string="";

  
  fetchpnr(event:any)
  { 
    const pattern = /^[0-9]*$/;   
  
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9]/g, "");
  
    }
    this.trncomplaint.pnrUtsNo=event.target.value
    console.log(this.trncomplaint.pnrUtsNo);
    if(this.trncomplaint.pnrUtsNo != null && this.trncomplaint.pnrUtsNo != undefined && this.trncomplaint.pnrUtsNo.length == 10)
    {

      this.httpProvider.getMethod("common/PnrData?PNR="+this.trncomplaint.pnrUtsNo).subscribe((data) => 
      {this.berthArr=[];
        this.coachArr=[];
       
        
             // data=JSON.parse(data)
                console.log(data);
               if(data.errormsg != "")
               {
                this.pnrFlag=false;
                this.toastProvider.presentToast(data.errormsg);

               }
               else
               {


                this.trncomplaint.trainNo=data.lapList.trainNo[0]+" - "+data.lapList.trainName[0];
                this.trncomplaint.berthClass=data.lapList.cls[0];
                this.trncomplaint.boardingStation=data.lapList.brdpt[0];
                this.trncomplaint.fromStation=data.lapList.stnfrom[0];
                this.trncomplaint.toStation=data.lapList.stnto[0];
                this.trncomplaint.totalFare=data.totalFare;
                this.trncomplaint.psgnNo=data.num_psgns;
                
                this.trncomplaint.journeyDay=data.lapList.day[0];
                this.trncomplaint.journeyMonth=data.lapList.month[0];
                this.trncomplaint.journeyYear=data.lapList.year[0];
             

                var today = new Date();
                var journeyDate = new Date(data.lapList.year[0]+"-"+data.lapList.month[0]+"-"+data.lapList.day[0]);
                console.log(journeyDate>today);
                  if(journeyDate>today)
                  {
                    this.pnrFlag=false;
                    this.toastProvider.presentToast("Future PNR not allowed");
                  }
                  else
                {
                if(Number(this.trncomplaint.psgnNo)>0)
                {
                  for(var i=0;i<Number(this.trncomplaint.psgnNo);i++) {
                    var psgnCoachStatus=data.psgnList.lapOnecurstat[i];
                    console.log(i+"cbdf0"+psgnCoachStatus);
                    if((psgnCoachStatus.indexOf("Can") != -1) 		|| 
								(psgnCoachStatus.indexOf("W/L") != -1)	|| 
								(psgnCoachStatus.indexOf("CNF") != -1) 	|| 
								(psgnCoachStatus.indexOf("RAC") != -1)){
							console.log("Waiting List : " +psgnCoachStatus);
						}
						else{

              if(psgnCoachStatus.indexOf("R") != -1){	
              if(this.coachArr.indexOf(psgnCoachStatus.substring(1, psgnCoachStatus.indexOf(" "))) == -1)
              {
                this.coachArr.push(psgnCoachStatus.substring(1, psgnCoachStatus.indexOf(" ")));
              }
                this.berthArr.push(psgnCoachStatus.substring(psgnCoachStatus.indexOf(" ") + 3, psgnCoachStatus.length));

							}
							else{
                if(this.coachArr.indexOf(psgnCoachStatus.substring(0, psgnCoachStatus.indexOf(",") - 1)) == -1)
                {
                  this.coachArr.push(psgnCoachStatus.substring(0, psgnCoachStatus.indexOf(",") - 1));
                }
                this.berthArr.push(psgnCoachStatus.substring(psgnCoachStatus.indexOf(",") + 1, psgnCoachStatus.length));

							}

                }
               }
               if(this.coachArr.length>0)
               {
                 this.pnrFlag=true;
 
               }
               else
               {
                 this.pnrFlag=false;
                 this.toastProvider.presentToast("PNR in waiting list");
 
 
               }
               
              }
            }
              
            }
            
      });


     
      

    
    }
  }


  resetvalues()
  {
    this.pnrFlag=false;
    this.trncomplaint.trainNo=null;
    this.trncomplaint.berthClass=null;
    this.trncomplaint.boardingStation=null;
    this.trncomplaint.fromStation=null;
    this.trncomplaint.toStation=null;
    this.trncomplaint.totalFare=null;
    this.trncomplaint.psgnNo=null;
    this.berthArr=null;
    this.coachArr=null;
    this.trncomplaint.pnrUtsNo=null;
    this.trncomplaint.journeyDay=null;
    this.trncomplaint.journeyMonth=null;
    this.trncomplaint.journeyYear=null;
    this.berthArr=[];
    this.coachArr=[];
  }

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
    private camera: Camera,private toastProvider:ToastProvider,public loadingProvider :LoadingProvider,
    private alertCtrl: AlertController) {
   
  }

  resetdet()
  {
    this.getComplaintList();
    this.getTrainList();

    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
    
    var minusfivedays=new Date(Date.now() - tzoffset);
    minusfivedays.setDate(minusfivedays.getDate()-5);
    var minTime =minusfivedays.toISOString().slice(0,-1);
   
    this.trncomplaint.incidentDate=localISOTime;
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


    else
    {
      this.trncomplaint.contact=localStorage.getItem('contact');
      this.trncomplaint.complainantName=localStorage.getItem('fullname');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComplaintStationPage');
  }

  getSubComplaintList()
  {
    this.httpProvider.getMethod("common/SubHeadList?Id="+this.trncomplaint.complaint).subscribe((data) => 
    {
     
      if(data.length >0)
            {
                this.subcomplaintArr=data; 
                this.trncomplaint.subComplaint=data[0].id;
            }
          else{
                this.subcomplaintArr=[];
                    

             }
    });
  }

  getComplaintList()
  {
    
    this.httpProvider.getMethod("common/HeadListById?Id=\"t\"").subscribe((data) => 
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


 

  search(event) {
    
   
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



  calenderArr=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];

  submitcomplaint(f:NgForm)
  {
    if(f.invalid)
    {
      this.toastProvider.presentToast("Please enter all the mandatory fields.");
    }
    else
    {


      if(this.trncomplaint.contact.indexOf("@") != -1)
      {
        this.trncomplaint.complainantEmail=this.trncomplaint.contact;
      }
      else
      {
        this.trncomplaint.complainantMobile=this.trncomplaint.contact;

      }
      if(this.trncomplaint.pnrUtsFlag=='P' && this.pnrFlag==false)
      {
        this.toastProvider.presentToast("Please enter a valid PNR.");

      }
      else
      {
        this.trncomplaint.image=this.myphoto;
        if(this.trncomplaint.pnrUtsFlag=='U')
        { 
          this.trncomplaint.trainName=(this.trncomplaint.trainNo as any).train_name.split(':-')[0];
          this.trncomplaint.trainNo=(this.trncomplaint.trainNo as any).train_name.split(':-')[1];
        }
        else{
          this.trncomplaint.trainName=this.trncomplaint.trainNo.split('-')[1].trim();
          this.trncomplaint.trainNo=this.trncomplaint.trainNo.split('-')[0].trim();
        }
        this.loadingProvider.presentLoadingDefault();

        this.httpProvider.postMethod("complaint/train",this.trncomplaint).subscribe((data) => 
        {

         
          if(data.code== "" || data.code== "0")
                {
                    this.toastProvider.presentToast(data.message) ;
    
                }
              else{
                   this.ref=data.complaintReferenceNo;
                   if(this.trncomplaint.pnrUtsFlag=='U')
                   { 
                    var temptrain={"train_name":this.trncomplaint.trainNo+"-"+this.trncomplaint.trainName}
                    this.trncomplaint.trainNo=temptrain as any;
                   }
                   else{
                  this.trncomplaint.trainNo=this.trncomplaint.trainNo+"-"+this.trncomplaint.trainName;
                    
                   }

                  
                  this.presentConfirm(this.ref,f);
                 }
        },err=> {
          console.log(err);
          
        this.toastProvider.presentToast("Check Error "+err);
        
      },()=>
        {
          this.loadingProvider.dismissLoading();
        });
     
    /*  
    
     if(this.trncomplaint.journeyDay.length<2)
      {
        this.trncomplaint.journeyDay="0"+this.trncomplaint.journeyDay;
      }
      this.httpProvider.getMethod1("https://enquiry.indianrail.gov.in/crisntes/"+
      "Services?serviceType=SpotTrain&trainNo="+this.trncomplaint.trn_no.substring(0,this.trncomplaint.trn_no.indexOf('-')-1)
      +"&jStation=NDLS&jDate="+this.trncomplaint.journeyDay+"-"+this.calenderArr[this.trncomplaint.journeyMonth]+"-"+this.trncomplaint.journeyYear+
      "&jEvent=A&usrId=PRSUSR&paswd=ruby676"+this.trncomplaint.trn_head).subscribe((data) => 
      {
       
     console.log(data);
      });*/
    }
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
            this.navCtrl.push(LoginPage);

          }
        }
      ]
    });
    alert.present();
  }
}
