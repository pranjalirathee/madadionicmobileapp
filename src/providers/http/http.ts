
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from  '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as constants from '../../constants/coms-constants';
import  'rxjs/add/operator/catch';
import  'rxjs/add/operator/timeout';


import  'rxjs/add/operator/map';
import { map, catchError } from 'rxjs/operators';

/*
  Generated class for the HttpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpProvider  {

  constructor(private  httpClient : HttpClient) { }
  httpOptions = {headers: new HttpHeaders({

       'Authorization': 'Basic ZXh0ZXJuYWx1c2VyOm1AZEBkYWRtMW4=' })};
  public  getMethod1(url): Observable<any> {


    return  this.httpClient

    .get(url).timeout(10000000)

    .map(response  => {

    return  response;

    });
  }
  public  getMethodWithOption(url,options): Observable<any> {


    return  this.httpClient

    .get(constants.BASE_URL+constants.CONTEXT_ROOT+url,options).timeout(10000000)

    .map(response  => {
      console.log(response);
    return  response;

    });
  }

  public  getMethodNotAPI(url): Observable<any> {


    return  this.httpClient

    .get(constants.BASE_URL+url).timeout(10000000)

    .map(response  => {

    return  response;

    });
  }

        public  getMethod(url): Observable<any> {


          return  this.httpClient

          .get(constants.BASE_URL+constants.CONTEXT_ROOT+url,this.httpOptions).timeout(10000000)

          .map(response  => {

          return  response;

          });
        }


        public  postMethod(url,data): Observable<any> {

          return  this.httpClient

          .post(constants.BASE_URL+constants.CONTEXT_ROOT+url,data,this.httpOptions).timeout(10000000)

          .map(response  => {

          return  response;

          });



          }

          public  putMethod(url,data): Observable<any> {

            return  this.httpClient

            .put(constants.BASE_URL+constants.CONTEXT_ROOT+url,data).timeout(10000000)

            .map(response  => {

            return  response;

            });



            }


            public  patchMethod(url,data): Observable<any> {

              return  this.httpClient

              .patch(constants.BASE_URL+constants.CONTEXT_ROOT+url,data).timeout(10000000)

              .map(response  => {

              return  response;

              });



              }



}

