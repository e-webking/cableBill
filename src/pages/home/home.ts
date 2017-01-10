import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading} from 'ionic-angular';
import { BillingAuthenticationApi } from '../../providers/BillingAuthenticationApi';
import { BillingCustomerApi } from '../../providers/BillingCustomerApi';
import { StorageService } from '../../providers/StorageService';
import { Agent } from '../../providers/BillingAuthenticationApi';
import { Customer } from '../../providers/BillingCustomerApi';
import { LoginPage } from '../login/login';

import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  agent: Agent;
  loading: Loading;

  constructor(private storageSrv: StorageService, public navCtrl: NavController, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private authApi: BillingAuthenticationApi, private customerApi: BillingCustomerApi) {
    
    let agentVal = this.authApi.getAgent();
    this.agent = agentVal;
    this.customerApi.getCustomers(this.agent.id, this.agent.token).subscribe(
     data => {
        if(data) {
          //loop the customers
         
        } else {
          this.showError("Access Denied!");
        }
     },
     error => {
      this.showError(error);
    });
          
  }

  public logout() {
  let confirm = this.alertCtrl.create({
      title: 'Sign OUT!',
      message: 'Are you sure to log out?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'YES',
          handler: () => {
            let navTransition = confirm.dismiss();
            this.authApi.logout().subscribe(succ => {
                this.storageSrv.removeAgent();
            });

            return false;
          }
        }
      ]
    });
    confirm.present();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  showError(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });
 
    let alert = this.alertCtrl.create({
      title: 'Login Failure',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
}
