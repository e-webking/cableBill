import {Injectable} from '@angular/core';

@Injectable()
export class GlobalVars {
 

  public authURL: string = "http://billing.local/index.php?id=29";
  public logoutURL: string = "http://billing.local/routing/logout/";
  public customerURL: string = "http://billing.local/routing/customer/";
  public billURL: string = "http://billing.local/routing/customer-bill/";

  
  constructor() {
  }
}
