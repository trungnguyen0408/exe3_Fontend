import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'exe2';

  public isLoggedIn$: Observable<boolean>  = new Observable<boolean>();

  constructor(private AuthService:AuthService){}

  public ngOnInit(){
    this.isLoggedIn$ = this.AuthService.isLoggedIn();
  }

  public logoutAccount(){
    this.AuthService.logout();
  }
}
