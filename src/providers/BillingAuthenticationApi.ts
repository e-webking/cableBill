import {Injectable} from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export class Agent {
  id: number;
  name: string;
  email: string;
  pass: string;
  session: string;
 
  constructor(id: number, name:string, email: string, pass: string, session: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.pass = pass;
    this.session = session;
  }
}

@Injectable()
export class BillingAuthenticationApi {
  
  private authURL: string = "http://billing.pa247.net/index.php?id=34";
  currentAgent: Agent;
  
  constructor(public http: Http) {
  }

  public login(user,pass) {
    if(user === null || pass === null) {
      return Observable.throw("Please enter access details!");
    } else {
      return Observable.create(observer => {
        this.http.get(this.authURL + '&user=' + user + '&pass=' + pass + '&logintype=login&type=90')
          .map(res => res.json()).subscribe(data => {
            //console.log('At API');
            //console.log(JSON.stringify(data));

            if(data.status == "OK") {
              this.currentAgent = new Agent(data.agent,data.name,user,pass,data.session_id);
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
      this.http.get(this.authURL + '&user=' + this.currentAgent.email + '&pass=' + this.currentAgent.pass + '&logintype=logout&type=90');
      this.currentAgent = null;
      observer.next(true);
      observer.complete();
    });
  }
}