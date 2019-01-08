import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { StationNameProvider } from '../../providers/station-name/station-name';

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
  myDate:String;
  minDate:String;
  maxDate:String;

  constructor(public navCtrl: NavController, public navParams: NavParams,public httpProvider:HttpProvider,
    public completeTestService: StationNameProvider) {
   
  }

  ionViewWillEnter(){
    this.getComplaintList();

    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
    
    var minusfivedays=new Date(Date.now() - tzoffset);
    minusfivedays.setDate(minusfivedays.getDate()-5);
    var minTime =minusfivedays.toISOString().slice(0,-1);
   
    this.myDate=localISOTime;
    this.minDate=minTime;
    this.maxDate=localISOTime;
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComplaintStationPage');
  }

  getSubComplaintList()
  {
    this.httpProvider.getMethod("RlyHeadsSubheadsMasters?filter={\"where\": {\"parentId\":{ \"eq\": 1 }}}").subscribe((data) => 
    {
     
      if(data.data.length >0)
            {
                this.subcomplaintArr=data.data; 
            }
          else{
                this.subcomplaintArr=[];
                    

             }
    });
  }

  getComplaintList()
  {
    
    this.httpProvider.getMethod("RlyHeadsSubheadsMasters?filter={\"where\": {\"parentId\":{ \"eq\": null }}}").subscribe((data) => 
    {
     
      if(data.data.length >0)
            {
                this.complaintArr=data.data; 
            }
          else{
                this.complaintArr=[];
                    

             }
    });
  }
}
