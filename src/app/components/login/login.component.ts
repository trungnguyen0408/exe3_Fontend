import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Account } from 'src/app/models/account.model';
import { AuthService } from 'src/app/services/auth.service';



declare let alertify: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService:AuthService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }
  //properties
  public loginForm = this.formBuilder.group({
    userName: ['', Validators.required],
    passWord: ['', Validators.required]
  });
  public account:Account = {
    userName : '',
    passWord : ''
  };
  public Login(){
    this.account = {
      userName: this.loginForm.value.userName,
      passWord: this.loginForm.value.passWord
    }
    this.authService.getAccountById(this.account.userName).subscribe(accountVM=>{
      if(accountVM != undefined){
        if(this.account.userName === accountVM.userName  && this.account.passWord === accountVM.password ){

          setTimeout(() => {
            this.authService.login(accountVM);
            this.authService.isLoggedIn();
          },2000);
          alertify.success('Login success');

        }else{
          alertify.error('Password is wrong');
        }
      }else{
        alertify.warning('User name does not exist');
      }
    });
  }
}
