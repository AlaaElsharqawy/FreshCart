import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {

  private readonly authService=inject(AuthService);
  private readonly router=inject(Router);
  step:number=1;
  isLoding:boolean=false;

  verifyEmail:FormGroup=new FormGroup({
    email:new FormControl(null,[Validators.required,Validators.email]),
  });
  verifyCode:FormGroup=new FormGroup({
    resetCode:new FormControl(null,[Validators.required]),
  });

  resetPassword:FormGroup=new FormGroup({
    email:new FormControl(null,[Validators.required,Validators.email]),
    newPassword:new FormControl(null , [Validators.required , Validators.pattern(/^[A-Z]\w{7}$/)]),
  });


verifyEmailSubmit():void{
  this.isLoding=true;

  let EmailValue= this.verifyEmail.get('email')?.value;
  this.resetPassword.get('email')?.patchValue(EmailValue);

  this.authService.setEmailVerify(this.verifyEmail.value).subscribe({
  next:(res)=>{
    console.log(res); 
    if(res.statusMsg=='success'){
      this.step=2;
    }
    this.isLoding=false;
  },
  error:(err)=>{
    console.log(err);
    this.isLoding=false;
  }
  })
}


verifyCodeSubmit():void{
  this.isLoding=true;



  this.authService.setCodeVerify(this.verifyCode.value).subscribe({
  next:(res)=>{
    console.log(res); 
    if(res.status=='Success'){
      this.step=3;
    }
    this.isLoding=false;
  },
  error:(err)=>{
    console.log(err);
    this.isLoding=false;
  }
  })
}

ResetPasswordSubmit():void{
  this.isLoding=true;
  this.authService.setResetPassword(this.resetPassword.value).subscribe({
  next:(res)=>{
    console.log(res); 
    localStorage.setItem('userToken',res.token);
    this.authService.tokenData();
  
    this.router.navigate(['/home']);
    this.isLoding=false;

  },
  error:(err:HttpErrorResponse)=>{
    console.log(err);
 
    this.isLoding=false;
  }
  })
}




}
