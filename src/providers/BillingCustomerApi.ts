import {Injectable} from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import { Agent } from './BillingAuthenticationApi';
import 'rxjs/add/operator/map';

export class Customer {
  id: number;
  agent: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  locality: string;
  zip: string;
  stbno: string;
  ipno: string;
 
  constructor(id: number, agent:number, name:string, email: string, phone: string, address: string, locality:string, zip: string, stbno: string, ipno: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.agent = agent;
    this.phone = phone;
    this.address = address;
    this.locality = locality;
    this.zip = zip;
    this.stbno = stbno;
    this.ipno = ipno;
  }
}

@Injectable()
export class BillingCustomerApi {
  
  private customerURL: string = "http://billing.local/routing/customer/";
  agent: Agent;
  currentCustomer: Customer;
  
  constructor(public http: Http) {
  }

  public getCustomers(agentid, token) {
    if (agentid === null) {
      return Observable.throw("Unauthorize access!");
    } else {
      return Observable.create(observer => {
        this.http.get(this.customerURL + agentid + '/' + token).map(res => res.json()).subscribe(data => {
            console.log(JSON.stringify(data));

            if(data.status == "OK") {
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