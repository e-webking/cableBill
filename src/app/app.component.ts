import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { GlobalVars } from '../providers/globalVars';
import { BillingAuthenticationApi } from '../providers/BillingAuthenticationApi';
import { LoginPage } from '../pages/login/login';


@Component({
  templateUrl: 'app.html',
  providers: [GlobalVars, BillingAuthenticationApi] 
})
export class MyApp {
  rootPage = LoginPage;

  constructor(platform: Platform, private apiConfig: GlobalVars, public billingApi: BillingAuthenticationApi) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
