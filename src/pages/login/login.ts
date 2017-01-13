import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { BillingAuthenticationApi, Agent } from '../../providers/BillingAuthenticationApi';
import { StorageService } from '../../providers/StorageService';
import { HomePage } from '../home/home';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loading: Loading;
  agent: Agent;
  loginForm: any = {};

  constructor(private storageSrv: StorageService, public navCtrl: NavController, private billingApi: BillingAuthenticationApi, private alertCtrl: AlertController, private loadingCtrl: LoadingController, formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
        user: ['', Validators.required],
        pass: ['', Validators.required]
    });
  }

  removeAgent() {
    this.storageSrv.removeAgent();
  }

  ngOnInit() {
    this.removeAgent();
  }

  public login () {
      this.showLoading();
      this.billingApi.login(this.loginForm.value.user,this.loginForm.value.pass).subscribe(
       data => {
          if(data) {
            let agentVal = this.billingApi.getAgent();
            this.storageSrv.setAgent(agentVal.id, agentVal.name, agentVal.email, agentVal.pass, agentVal.token);
            
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
