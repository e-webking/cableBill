import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { BillingAuthenticationApi } from '../../providers/BillingAuthenticationApi';
import { Agent } from '../../providers/BillingAuthenticationApi';
import { HomePage } from '../home/home';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  user: string;
  pass: string;
  loading: Loading;
  agent: Agent;

  constructor(storage: Storage, public navCtrl: NavController, private billingApi: BillingAuthenticationApi, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {

    storage.get('agent').then(
      data => {
        if(data !== null) {
          this.agent = new Agent(data.id,data.name,data.email,data.pass,data.session);
        }
      },
      error => console.error(error)
    );
  }

  public login () {
    this.showLoading();
    this.billingApi.login(this.user,this.pass).subscribe(
     data => {
        if(data) {

          setTimeout(() => {
            this.loading.dismiss();
            this.navCtrl.setRoot(HomePage)
          });
        } else {
          this.showError("Access Denied!");
        }
     },
     error => {
      this.showError(error);
    });
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
