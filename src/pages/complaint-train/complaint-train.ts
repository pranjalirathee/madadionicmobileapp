import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  complaintArr=[];
  subcomplaintArr=[];
  trainArr=[];
  berthArr=[];
  coachArr=[];

  trncomplaint=<ComplaintModel>{};


  minDate:String;
  maxDate:String;


  results:string[]=[];


  myphoto:any;
  pnrFlag=false;
  ref:string="";

  
  fetchpnr()
  {
    if(this.trncomplaint.pnrUtsNo.length == 10)
    {
      var data="{\"trainNo\":\"12424 - DBRT RAJDHANI\",\"incomingSmsId\":0,\"complaintType\":0,\"berthCls\":\"2A\",\"boardingStn\":\"NDLS\",\"fromStation\":\"NDLS\",\"toStation\":\"DBRT\",\"totalAmount\":4810,\"totalPass\":1,\"selectCoachNo\":true,\"coachNoList\":[\"A2 \"],\"selectBerthNo\":true,\"berthNoList\":[\" 17\"],\"day\":9,\"month\":1,\"year\":2019,\"exSize\":false,\"fetchError\":false,\"passengerList\":[\"BALJINDER SINGH\"],\"selectName\":true,\"stationList\":[],\"trainList\":[],\"errMsg\":\"\"}"
      data=JSON.parse(data);
      this.pnrFlag=true;
      this.trncomplaint.trainNo=(data as any).trainNo;
      this.trncomplaint.berthClass=(data as any).berthCls;
      this.trncomplaint.boardingStation=(data as any).boardingStn;
      this.trncomplaint.fromStation=(data as any).fromStation;
      this.trncomplaint.toStation=(data as any).toStation;
      this.trncomplaint.totalFare=(data as any).totalAmount;
      this.trncomplaint.psgnNo=(data as any).totalPass;
      this.berthArr=(data as any).berthNoList;
      this.coachArr=(data as any).coachNoList;
      this.trncomplaint.journeyDay=(data as any).day;
      this.trncomplaint.journeyMonth=(data as any).month;
      this.trncomplaint.journeyYear=(data as any).year;

    
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
  }

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
    this.getTrainList();

    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
    
    var minusfivedays=new Date(Date.now() - tzoffset);
    minusfivedays.setDate(minusfivedays.getDate()-5);
    var minTime =minusfivedays.toISOString().slice(0,-1);
   
    this.trncomplaint.incidentDate=localISOTime;
    this.minDate=minTime;
    this.maxDate=localISOTime;
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComplaintStationPage');
  }

  getSubComplaintList()
  {
    this.httpProvider.getMethod("coms/ComsSubHeadList?Id="+this.trncomplaint.complaint).subscribe((data) => 
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
    
    this.httpProvider.getMethod("coms/ComsHeadListById?Id=\"t\"").subscribe((data) => 
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
    
    this.httpProvider.getMethod("coms/StationList").subscribe((data) => 
    {
     
      if(data.length >0)
            {
                this.trainArr=data; 

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
      station => station.station_name.toLowerCase().indexOf(event.query.toLowerCase()) != -1);
    }

    else
    {
      this.results=this.trainArr;
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

  calenderArr=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];

  submitcomplaint(f:NgForm)
  {
    if(f.invalid)
    {
      this.toastProvider.presentToast("Please enter all the mandatory fields.");
    }
    else
    {

      if(this.trncomplaint.pnrUtsNo=='P' && this.pnrFlag==false)
      {
        this.toastProvider.presentToast("Please enter a valid PNR.");

      }
      else
      {
      if(this.trncomplaint.journeyDay.length<2)
      {
        this.trncomplaint.journeyDay="0"+this.trncomplaint.journeyDay;
      }
    /*  this.httpProvider.getMethod1("https://enquiry.indianrail.gov.in/crisntes/"+
      "Services?serviceType=SpotTrain&trainNo="+this.trncomplaint.trn_no.substring(0,this.trncomplaint.trn_no.indexOf('-')-1)
      +"&jStation=NDLS&jDate="+this.trncomplaint.journeyDay+"-"+this.calenderArr[this.trncomplaint.journeyMonth]+"-"+this.trncomplaint.journeyYear+
      "&jEvent=A&usrId=PRSUSR&paswd=ruby676"+this.trncomplaint.trn_head).subscribe((data) => 
      {
       
     console.log(data);
      });*/
    }
    }
  }
}
