import { Component } from '@angular/core';
import { NativeStorage} from 'ionic-native';
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
  constructor(public navCtrl: NavController, private billingApi: BillingAuthenticationApi, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {

    NativeStorage.getItem('agent').then(function(data){
      this.agent = data;
    }, function (error) {console.log(error)});
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
