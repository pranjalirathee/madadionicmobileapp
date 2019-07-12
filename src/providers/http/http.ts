
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from  '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as constants from '../../constants/coms-constants'; 
import  'rxjs/add/operator/catch';
import  'rxjs/add/operator/timeout';


import  'rxjs/add/operator/map';

/*
  Generated class for the HttpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpProvider {

  constructor(private  httpClient : HttpClient) { }

  public  getMethod1(url): Observable<any> {
       
        
    return  this.httpClient
    
    .get(url).timeout(10000000)
    
    .map(response  => {
    
    return  response;
    
    });  
  }

        public  getMethod(url): Observable<any> {
       
        
          return  this.httpClient
          
          .get(constants.BASE_URL+constants.CONTEXT_ROOT+url).timeout(10000000)
          
          .map(response  => {
          
          return  response;
          
          });  
        }
     
      
        public  postMethod(url,data): Observable<any> {
         
          return  this.httpClient
          
          .post(constants.BASE_URL+constants.CONTEXT_ROOT+url,data).timeout(10000000)
          
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
