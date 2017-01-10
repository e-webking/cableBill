import {Injectable} from '@angular/core';
import { Storage } from '@ionic/storage';
import {Observable} from 'rxjs/Observable';
import { Agent } from './BillingAuthenticationApi';
import 'rxjs/add/operator/map';

@Injectable()
export class StorageService {

	currentAgent: Agent;
  
  	constructor(public storage: Storage) {
    this.storage = storage;
  	}


  	public loadAgent() {

		return Observable.create(observer => {

			this.storage.get('agent').then(
				data => {
		        	if(data !== null) {
			          this.currentAgent = new Agent(data.id,data.name,data.email,data.pass,data.token);
			          observer.next(true);
			        } else {
			        	observer.next(false);
			        }
			        observer.complete();
				});
		});
    }

    public getAgent() : Agent {
    	return this.currentAgent;
    }

    public removeAgent() {
    	this.loadAgent().subscribe(
    		data => {
    			if(data) {
    				this.storage.remove('agent');
    			}
    		}
    	);
    }

    public setAgent(id,name,email,pass,token) {
    	this.storage.set('agent', {id: id, name: name, email: email, pass: pass, token:token});
    }
}