import {Injectable} from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {GlobalVars} from './globalVars';
import { Agent } from './BillingAuthenticationApi';

export class Customer {
  id: number;
  agent: number;
  name: string;
  email: string;
  mobile: string;
  address: string;
  locality: string;
  zip: string;
  city: string;
  stbno: string;
  ipno: string;
  photo: string;
 
  constructor(id: number, agent:number, name:string, email: string, phone: string, address: string, locality:string, zip: string, city: string, stbno: string, ipno: string, photo: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.agent = agent;
    this.mobile = phone;
    this.address = address;
    this.locality = locality;
    this.zip = zip;
    this.city = city;
    this.stbno = stbno;
    this.ipno = ipno;
    this.photo = photo;
  }
}

@Injectable()
export class BillingCustomerApi {
  customerURL: string;
  billURL: string;
  agent: Agent;
  currentCustomerData: any = {};
  customerArr: Array<Customer>;
  constructor(public http: Http, apiConfig: GlobalVars) {
    this.customerURL = apiConfig.customerURL;
    this.billURL = apiConfig.billURL;
  }

  public loadCustomers(agentid, token) {
    if (agentid === null) {
      return Observable.throw("Unauthorize access!");
    } else {
      return Observable.create(observer => {
        this.http.get(this.customerURL + agentid + '/' + token).map(res => res.json())
        .subscribe(data => {
            //console.log(JSON.stringify(data));

            if(data.status == "OK") {
              this.customerArr = data.customers;
              observer.next(1);
            } else {
              observer.next(false);
            }
            observer.complete();
        });
      });
    }
  }

  public getCustomers()
  {
    return this.customerArr;
  }

  public filterLocality(searchTerm){
      return this.customerArr.filter((item) => {
          return item.locality.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || 
                  item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || 
                  item.mobile.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });
  }

  public loadCustomerData(agentid,customerid) {
    if (agentid === null || customerid === null) {
      return Observable.throw("Invalid request!");
    } else {
      return Observable.create(observer => {
        this.http.get(this.billURL + agentid + '/' + customerid).map(res => res.json())
        .subscribe(data => {
            //console.log(JSON.stringify(data));

            if (data.status == "OK") {
              this.currentCustomerData = data.data;
              observer.next(1);
            } else {
              observer.next(false);
            }
            observer.complete();
        });
      });
    }
  }

  public getCustomerData() {
    return this.currentCustomerData;
  }

  public pay(agent:number, customer: number, bill: number, amount: number, token: string) {
     console.log('Agent: ' + agent + ', Customer: ' + customer + ', Bill: ' + bill + ", Amount: " + amount + 'token: ' + token);
    if(agent === null || token === null || customer === null || bill === null || amount === null) {
      return Observable.throw("Invalid input!");
    } else {
      let postData = 'bill=' + bill + '&amount=' + amount + '&token=' + token;
      let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
          });
      let options = new RequestOptions({
            headers: headers
          });
          
      return Observable.create(observer => {
          

         this.http.post(this.billURL + agent + '/' + customer, postData, options).map(res => res.json())
        .subscribe(data => {
            if (data.status == "OK") {
              observer.next(true);
            } else {
              observer.next(false);
            }
            observer.complete();
          });
      });
    }
  }
}