import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading} from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { CallNumber} from 'ionic-native';
import { BillingAuthenticationApi, Agent } from '../../providers/BillingAuthenticationApi';
import { BillingCustomerApi, Customer } from '../../providers/BillingCustomerApi';
import { StorageService } from '../../providers/StorageService';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-customer',
  templateUrl: 'customer.html'
})

export class CustomerPage {

	agent: Agent;
  	loading: Loading;
  	public customer: any;
  	public bills: any = [];
  	public due: any;
  	cusid: any;

	constructor(private storageSrv: StorageService, public navCtrl: NavController, public params:NavParams, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private authApi: BillingAuthenticationApi, private customerApi: BillingCustomerApi) {
		this.cusid = params.get("customer");
		this.showLoading();
	}

	ionViewWillEnter() {
	    let agentVal = this.authApi.getAgent();
	    this.agent = agentVal;
	    this.getCustomer().then(()=>{
	    	setTimeout(() => {
              this.loading.dismiss();
            });
	    });
    }

    getCustomer() {

	    return new Promise(resolve => {
	      
	      this.customerApi.loadCustomerData(this.agent.id, this.cusid ).subscribe(
	        data => {
	          if (data) {
	           let customerArr = this.customerApi.getCustomerData();
	           this.customer = customerArr.customer;
	           this.due = customerArr.due;
	           for(let bill of customerArr.bills) {
	           		console.log(bill);
            		this.bills.push(bill);
           		}
	            resolve(true);
	          }
	        });
	    });
	  }

    callPhone () {
    	CallNumber.callNumber(this.customer.mobile, true);
  	}

  	showLoading() {
    	this.loading = this.loadingCtrl.create({
      		content: 'Please wait...'
    	});
    	this.loading.present();
  	}
}