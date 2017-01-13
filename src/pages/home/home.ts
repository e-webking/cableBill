import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading} from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { CallNumber} from 'ionic-native';
import { BillingAuthenticationApi, Agent } from '../../providers/BillingAuthenticationApi';
import { BillingCustomerApi, Customer } from '../../providers/BillingCustomerApi';
import { StorageService } from '../../providers/StorageService';
import { LoginPage } from '../login/login';
import { CustomerPage } from '../customer/customer';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  agent: Agent;
  loading: Loading;
  public customers: any = [];
  searchTerm: string = '';
  searchControl: FormControl;
  searching: any = false;

  constructor(private storageSrv: StorageService, public navCtrl: NavController, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private authApi: BillingAuthenticationApi, private customerApi: BillingCustomerApi) {  
    this.searchControl = new FormControl();
  }

  ngOnInit() {
    let agentVal = this.authApi.getAgent();
    this.agent = agentVal;
    this.getCustomers().then(()=>{
      this.setFilteredItems();
      this.searchControl.valueChanges.debounceTime(400).subscribe(search => {
          this.searching = false;
          this.setFilteredItems();
      });
    });
    
  }

  onSearchInput(){
      this.searching = true;
  }

  setFilteredItems() {
    this.customers = this.customerApi.filterLocality(this.searchTerm);
  }

  getCustomers() {

    return new Promise(resolve => {
      
      this.customerApi.loadCustomers(this.agent.id, this.agent.token).subscribe(
        data => {
          if (data) {
           let customerArr = this.customerApi.getCustomers();
           for(let customer of customerArr) {
            this.customers.push(customer);
           }
           resolve(true);
          }
        });
    });
  }

  callPhone (phno: string) {
    CallNumber.callNumber(phno, true);
  }

  navigate (cusid: any) {
    this.navCtrl.push(CustomerPage,{
      customer: cusid
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
            
            this.authApi.logout().subscribe(succ => {
                this.storageSrv.removeAgent().subscribe(
                  data => {
                    if(data) {
                      let navTransition = confirm.dismiss();
                      this.navCtrl.setRoot(LoginPage);
                    }
                  }
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
