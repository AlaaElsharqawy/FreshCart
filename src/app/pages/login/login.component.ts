import { Component, inject } from '@angular/core';
import {  AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})



export class  LoginComponent {

 private readonly authService=inject(AuthService);
 private readonly router=inject(Router);
isLoding:boolean=false;
msgError:string="";
success:string="";

loginForm:FormGroup=new FormGroup({

email:new FormControl(null , [Validators.required , Validators.email]),
password:new FormControl(null , [Validators.required , Validators.pattern(/^[A-Z]\w{7}$/)]),

});

SubmitForm():void{
if(this.loginForm.valid){
  this.isLoding=true;
  console.log(this.loginForm.value);
this.authService.sendLoginForm(this.loginForm.value).subscribe({
  next:(res)=>{
console.log(res);
if(res.message=== 'success'){

setTimeout(()=>{
  //1)save token in localStorage
  localStorage.setItem('userToken',res.token);

  //2)DEcode Token
this.authService.tokenData();
  


//navigate  login
  this.router.navigate(['/home']);
},1000);

this.success=res.message;


}

this.isLoding=false;
this.loginForm.reset();

  },
  error:(err:HttpErrorResponse)=>{
    console.log(err);
  this.msgError= err.error.message;
    this.isLoding=false;
  }
})
}

}





}
