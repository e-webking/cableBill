import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, AlertController} from 'ionic-angular';
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
  constructor(private storage: Storage, public navCtrl: NavController, private alertCtrl: AlertController, private billingApi: BillingAuthenticationApi) {
    let agentVal = this.billingApi.getAgent();
    this.agent = agentVal;
    this.storage.set('agent', {id: agentVal.id, name: agentVal.name, email: agentVal.email, pass:agentVal.pass, session:agentVal.session});
          
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
            this.billingApi.logout().subscribe(succ => {
                this.storage.remove('agent').then(
                ()=>{
                  navTransition.then(() => {this.navCtrl.setRoot(LoginPage)});
                },
                error=>console.error(error)
                );
            });

            return false;
          }
        }
      ]
    });
    confirm.present();
  }
}
