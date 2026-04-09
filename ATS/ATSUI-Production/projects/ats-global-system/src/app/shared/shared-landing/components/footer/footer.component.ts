import { Component, OnInit,HostListener } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarConfig as MatSnackBarConfig } from '@angular/material/legacy-snack-bar';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  isConnected = true;
  showScroll: boolean;
  showScrollHeight = 100;
  hideScrollHeight = 10;
  public year:number = new Date().getFullYear();
  
  constructor(private snackBar: MatSnackBar) {
   
   
   }

   openSnackBar(message: string, action: string) {
    let config = new MatSnackBarConfig();
    config.panelClass =['custom-class-snack'];
    config.duration = 9000;
    this.snackBar.open(message, action,config);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() 
  {
    if (( window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) > this.showScrollHeight) 
    {
      this.showScroll = true;
    } 
    else if ( this.showScroll && (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) < this.hideScrollHeight) 
    { 
      this.showScroll = false; 
    }
  }

  scrollToTop() 
  { 
    (function smoothscroll() 
    { var currentScroll = document.documentElement.scrollTop || document.body.scrollTop; 
      if (currentScroll > 0) 
      {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 5));
      }
    })();
  }

  ngOnInit() {
  }

}
