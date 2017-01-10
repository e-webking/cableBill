import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { GlobalVars } from '../providers/globalVars';
import { BillingAuthenticationApi } from '../providers/BillingAuthenticationApi';
import { BillingCustomerApi } from '../providers/BillingCustomerApi';
import { StorageService } from '../providers/StorageService';
import { LoginPage } from '../pages/login/login';


@Component({
  templateUrl: 'app.html',
  providers: [GlobalVars, BillingAuthenticationApi, BillingCustomerApi, StorageService] 
})
export class MyApp {
  rootPage = LoginPage;

  constructor(platform: Platform, private apiConfig: GlobalVars, 
  public billingApi: BillingAuthenticationApi,
  public customerApi: BillingCustomerApi, public storageService: StorageService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
