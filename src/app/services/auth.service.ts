import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountVM } from '../models/account-vm.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private REST_API_SERVER = environment.api;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient ,private router: Router) { }

  public logout(){
    this.loggedIn.next(false);
    this.router.navigate(['']);
  }
  public login(account: AccountVM):void{
    if(account){
      this.loggedIn.next(true);
      this.router.navigate(['/home']);
    }
  }
  public isLoggedIn(): Observable<boolean>{
    return this.loggedIn.asObservable();
  }
  public getAccountById(userName: string): Observable<AccountVM> {
    const url = `${this.REST_API_SERVER}/api/Account/`+userName;
    return this.httpClient.get<AccountVM>(url, this.httpOptions);
  }
}
