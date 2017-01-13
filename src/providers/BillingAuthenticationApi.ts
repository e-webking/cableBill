import {Injectable} from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {GlobalVars} from './globalVars';

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

  currentAgent: Agent;
  authURL: string;
  logoutURL:string;

  constructor(public http: Http, apiConfig: GlobalVars) {
    this.http = http;
    this.authURL = apiConfig.authURL;
    this.logoutURL = apiConfig.logoutURL;
  }

  public login(user,pass) {
    if(user === null || pass === null) {
      return Observable.throw("Please enter access details!");
    } else {
      return Observable.create(observer => {
        //Access-Control-Allow-Origin

        this.http.get(this.authURL + '&user=' + user + '&pass=' + pass + '&logintype=login&type=90')
        .map(res => res.json()).subscribe(data => {

            //console.log(JSON.stringify(data));

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
      this.http.get(this.logoutURL + this.currentAgent.id + '/' + this.currentAgent.token).map(res => res.json()).subscribe(data => {
        if(data.status == 'OK') {
          this.currentAgent = null;
          observer.next(true);
          observer.complete();
        }
      });
      
    });
  }
}