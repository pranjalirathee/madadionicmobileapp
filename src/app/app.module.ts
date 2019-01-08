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
import { AutoCompleteModule } from 'ionic2-auto-complete';
import { StationNameProvider } from '../providers/station-name/station-name';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    CheckotpPage,
    ComplaintStationPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    AutoCompleteModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    CheckotpPage,
    ComplaintStationPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpProvider,
    ToastProvider,
    LoadingProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    StationNameProvider
  ]
})
export class AppModule {}
