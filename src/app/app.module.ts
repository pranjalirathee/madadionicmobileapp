import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { HttpProvider } from '../providers/http/http';
import { ToastProvider } from '../providers/toast/toast';
import { LoadingProvider } from '../providers/loading/loading';
import { CheckotpPage } from '../pages/checkotp/checkotp';
import { ComplaintStationPage } from '../pages/complaint-station/complaint-station';
import { StationNameProvider } from '../providers/station-name/station-name';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import {WebcamModule} from 'ngx-webcam';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { ComplaintTrainPage } from '../pages/complaint-train/complaint-train';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    CheckotpPage,
    ComplaintStationPage,
    ComplaintTrainPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    AutoCompleteModule,
    BrowserAnimationsModule,
    WebcamModule,
    IonicModule.forRoot(MyApp, { tabsPlacement: 'top',
    backButtonText: ''}, {
      links: [
       { component: CheckotpPage, name: 'checkotp', segment: 'checkotp' },
       { component: ComplaintStationPage, name: 'complaintstation', segment: 'complaintstation' },
       { component: LoginPage, name: 'login', segment: 'login' },
       { component: ComplaintTrainPage, name: 'complainttrain', segment: 'complainttrain' }


     ]
   })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    CheckotpPage,
    ComplaintStationPage,
    ComplaintTrainPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpProvider,
    ToastProvider,
    LoadingProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    StationNameProvider,
    FileTransfer,
    FileTransferObject,
    File,
    Camera
  ]
})
export class AppModule {}
