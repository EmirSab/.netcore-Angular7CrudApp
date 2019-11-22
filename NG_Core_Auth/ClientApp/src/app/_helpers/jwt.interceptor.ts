import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AccountService } from '../services/account.service';
import { Observable } from 'rxjs';

// 57 Creating the JWT Interceptor Class To Attach Token To HTTP Request ->app.module.ts
// napraviti ovaj file
// clasas za presretanje http requestova
@Injectable({
  providedIn: 'root'
})

export class JwtInterceptor implements HttpInterceptor {
  constructor(private acct: AccountService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
    // logika za presretanje
    // dodavanje authorization hedera
    let currentUser = this.acct.isLoggedIn;
    let token = localStorage.getItem('jwt');
    if (currentUser && token !== undefined)
    {
      request = request.clone({
        setHeaders:
        {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request);
  }
}
