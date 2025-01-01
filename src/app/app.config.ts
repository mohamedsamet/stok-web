import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import { provideHttpClient, withInterceptors} from "@angular/common/http";
import {tokenInterceptor} from "./interceptor/token.interceptor";
import {provideAnimations} from "@angular/platform-browser/animations";
import {httpErrorInterceptor} from "./interceptor/http-error.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([tokenInterceptor, httpErrorInterceptor])),
  ]
};
