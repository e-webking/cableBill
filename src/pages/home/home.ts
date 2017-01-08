import { Component } from '@angular/core';
import { NativeStorage} from 'ionic-native';
import { NavController } from 'ionic-angular';
import { BillingAuthenticationApi } from '../../providers/BillingAuthenticationApi';
import { Agent } from '../../providers/BillingAuthenticationApi';
import { LoginPage } from '../login/login';

import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  agent: Agent;
  constructor(public navCtrl: NavController, private billingApi: BillingAuthenticationApi) {
    let agentVal = this.billingApi.getAgent();
    NativeStorage.setItem('agent', agentVal);
    console.log(agentVal);
    this.agent = agentVal;      
  }

  public logout() {
    this.billingApi.logout().subscribe(succ => {
        this.navCtrl.setRoot(LoginPage)
    });
  }
}
