import {Injectable} from '@angular/core';

@Injectable()
export class GlobalVars {
  
  public authURL: string = "http://billing.pa247.net/index.php?id=34";
  public logoutURL: string = "http://billing.pa247.net/routing/logout/";
  public customerURL: string = "http://billing.pa247.net/routing/customer/";
  public billURL: string = "http://billing.pa247.net/routing/customer-bill/";


  //public authURL: string = "http://billing.local/index.php?id=29";
  //public logoutURL: string = "http://billing.local/routing/logout/";
  //public customerURL: string = "http://billing.local/routing/customer/";
 //public billURL: string = "http://billing.local/routing/customer-bill/";

  
  constructor() {
  }
}
