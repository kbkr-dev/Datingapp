import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const tostr = inject(ToastrService);

  return next(req).pipe(
    catchError(error => {
      if (error){
        switch (error.status){
          case 400:
            if(error.error.errors){
              const modalStateErrors = [];
              for(const key in error.error.errors){
                if(error.error.errors[key]){
                  modalStateErrors.push(error.error.errors[key])
                }
              }

              throw modalStateErrors.flat();
            }
            else{
              tostr.error(error.error, error.status);
            }
            break;
            case 401:
              tostr.error('Unauthorised', error.status);
              break;
            case 404:
              router.navigateByUrl('/');
              break;
            case 500:
              const navigationExtras: NavigationExtras = {state: {error: error.error}};
              router.navigateByUrl('/server-error', navigationExtras);
              break;
            default:
              tostr.error("Something is wrong");
              break;
        }
      }

      throw error;
    })
  );
};
