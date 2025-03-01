



import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  
  let router = inject(Router);
  let platformId = inject(PLATFORM_ID);

  // التحقق مما إذا كان الكود يعمل في المتصفح فقط
  if (isPlatformBrowser(platformId)) {
    if (localStorage.getItem('userToken') !== null) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  }

  // إذا لم يكن في المتصفح، نعيد false لمنع الوصول
  return false;
};