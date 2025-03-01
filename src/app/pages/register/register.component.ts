import { Component, inject } from '@angular/core';
import {  AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

 private readonly authService=inject(AuthService);
 private readonly router=inject(Router);
isLoding:boolean=false;
msgError:string="";
success:string="";

registerForm:FormGroup=new FormGroup({
name: new FormControl(null , [Validators.required , Validators.minLength(3) , Validators.maxLength(20)]),
email:new FormControl(null , [Validators.required , Validators.email]),
password:new FormControl(null , [Validators.required , Validators.pattern(/^[A-Z]\w{7}$/)]),
rePassword:new FormControl(null , [Validators.required ]),
phone:new FormControl(null , [Validators.required , Validators.pattern(/^01[0125][0-9]{8}$/)]),
},{validators:this.confirmPassword});

SubmitForm():void{
if(this.registerForm.valid){
  this.isLoding=true;
  console.log(this.registerForm.value);
this.authService.sendRegisterForm(this.registerForm.value).subscribe({
  next:(res)=>{
console.log(res);
if(res.message=== 'success'){
//navigate  login
setTimeout(()=>{
  this.router.navigate(['/login']);
},1000);

this.success=res.message;


}

this.isLoding=false;
this.registerForm.reset();

  },
  error:(err:HttpErrorResponse)=>{
    console.log(err);
  this.msgError= err.error.message;
    this.isLoding=false;
  }
})
}

}


confirmPassword(group:AbstractControl){
const Password=group.get('password')?.value;
const rePassword=group.get('rePassword')?.value;
if(Password===rePassword){
  return null;
}
else{
  return{misMatch:true};
}

}


}

