import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const lockedGuard: CanActivateFn = (route, state) => {

  let router=inject(Router);

  if(localStorage.getItem('userToken')!==null){
    router.navigate(['/home']);
      return false;
  }
  else{
   
    return true;
  }



};
