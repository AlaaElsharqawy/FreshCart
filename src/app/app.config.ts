import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { api_url } from './core/cutom_injection/api_url';
import { headerInterceptor } from './core/interceptors/header/header.interceptor';
import { errorInterceptor } from './shared/interfaces/error/error.interceptor';
import { NgxSpinnerModule } from "ngx-spinner";
import { loadingInterceptor } from './core/interceptors/loading/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes),
      provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(),withInterceptors([headerInterceptor,errorInterceptor,loadingInterceptor])),
    provideAnimations(),
    {
      provide:api_url,
      useValue:'https://ecommerce.routemisr.com/api/v1'
    },
    provideToastr(),
    importProvidersFrom(NgxSpinnerModule)
  
  ],
    
};
