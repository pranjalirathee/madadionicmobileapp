import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckotpPage } from './checkotp';

@NgModule({
  declarations: [
    CheckotpPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckotpPage),
  ],
})
export class CheckotpPageModule {}
