import {Injectable} from '@angular/core';

@Injectable()
export class GlobalVars {
  
  private authURL: string = "http://billing.pa247.net/index.php?id=34";
  private customerURL: string = "http://billing.pa247.net/index.php?id=34";
  private billURL:string = "http://billing.pa247.net/index.php?id=34";
  
  constructor() {
  }

  getAuthURL() {
    return this.authURL;
  }
  
}
