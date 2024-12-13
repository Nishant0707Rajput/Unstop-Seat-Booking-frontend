import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  req = addApikey(req, environment.X_API_KEY);

  return next(req);
};

function addApikey(request: HttpRequest<any>, apikey: string) {
  return request.clone({
    setHeaders: {
      'x-api-key': `${apikey}`,
    },
  });
}