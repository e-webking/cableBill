import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController, Loading} from 'ionic-angular';
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

	constructor(private storageSrv: StorageService, public navCtrl: NavController, public params:NavParams, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private authApi: BillingAuthenticationApi, private customerApi: BillingCustomerApi) {
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
	           		// console.log(bill);
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

  	payBill(bill: any) {
  		let confirm = this.alertCtrl.create({
  			title: 'Bill Payment',
  			message: 'Amount due: <i class="fa fa-inr"></i>' + bill.paydue,
  			inputs: [{
  				name: 'amount',
  				placeholder: 'Enter Amount'
  			}],
  			buttons: [{
  				text: 'CANCEL',
  				role: 'cancel',
  				handler: () => {}
  			},
  			{
  				text: 'PAY',
  				handler: data => {
  					if(!isNaN(data.amount)) {
  						let navTransition = confirm.dismiss();

	  					this.customerApi.pay(this.agent.id, this.customer.uid, bill.uid, data.amount, this.agent.token).subscribe(
	  						succ => {
	  							if(succ) {
	  								this.bills.length = 0;
	  								navTransition.then(()=>{
	  									this.showLoading();
	  									this.getCustomer().then(()=>{
									    	
								            this.loading.dismiss();
								            this.presentToast("Payment updated successfull!");
									    });
	  								});
  								} else {
  									navTransition.then(()=>{
  										this.presentToast("Payment failed!");
  									});
  								}

	  							return false;
	  						},
	  						err => {
                          		navTransition.then(()=>{
                            		this.presentToast("Something went wrong. Please try again!");
                            	});
                        	}
		           		);
		           		return false;
		            } else { 
		            	this.amountAlert();
	            		return false; 
	            	}
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

  	amountAlert() {
	  let alert = this.alertCtrl.create({
	    title: 'Amount',
	    subTitle: 'Please enter valid amount',
	    buttons: ['Dismiss']
	  });
	  alert.present();
	}

	presentToast(toastMessage) {
      let toast = this.toastCtrl.create({
        message: toastMessage,
        duration: 4000,
        position: 'bottom'
      });
      toast.present();
    }
}