
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from  '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import  'rxjs/add/operator/catch';
import  'rxjs/add/operator/timeout';


import  'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs';

/*
  Generated class for the HttpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserSession {
  loggedInFlag:false;
  private loggedInInfo: BehaviorSubject<boolean>;
  constructor() {
    this.loggedInInfo = new BehaviorSubject<boolean>(false);
   }
  setlogin(flag)
  {
      this.loggedInFlag=flag;
  }
  getlogin():boolean
  {
    return this.loggedInFlag;
  }
  getValue(): Observable<boolean> {
    return this.loggedInInfo.asObservable();
  }
  setValue(newValue): void {
    this.loggedInInfo.next(newValue);
  }


}
