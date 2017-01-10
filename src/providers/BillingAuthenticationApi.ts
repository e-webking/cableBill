import {Injectable} from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export class Agent {
  id: number;
  name: string;
  email: string;
  pass: string;
  token: string;
 
  constructor(id: number, name:string, email: string, pass: string, token: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.pass = pass;
    this.token = token;
  }
}

@Injectable()
export class BillingAuthenticationApi {
  
  private authURL: string = "http://typo3.local/billing/index.php?id=29";
  private logoutURL: string = "http://billing.local/routing/logout/";

  currentAgent: Agent;
  
  constructor(public http: Http) {
    this.http = http;
  }

  public login(user,pass) {
    if(user === null || pass === null) {
      return Observable.throw("Please enter access details!");
    } else {
      return Observable.create(observer => {
        //Access-Control-Allow-Origin

        this.http.get(this.authURL + '&user=' + user + '&pass=' + pass + '&logintype=login&type=90')
        .map(res => res.json()).subscribe(data => {

            console.log(JSON.stringify(data));

            if(data.status == "OK") {
              this.currentAgent = new Agent(data.agent,data.name,user,pass,data.token);
              observer.next(true);
            } else {
              observer.next(false);
            }
            observer.complete();
          });
      });
    }
    
  }

  public getAgent() : Agent {
    return this.currentAgent;
  }

  public logout() {
    return Observable.create(observer => {
      this.http.get(this.logoutURL + this.currentAgent.token);
      this.currentAgent = null;
      observer.next(true);
      observer.complete();
    });
  }
}