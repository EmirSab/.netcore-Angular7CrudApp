import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';
import { take, map } from 'rxjs/operators';
// 53 Creating Auth Guard Service To Access Components - Part 1 -> kreiranje access denied componente
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private acc: AccountService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean>
  {
    return this.acc.isLoggedIn.pipe(take(1), map((loginStatus: boolean) =>
    {
      const destination: string = state.url;
      const productId = route.params.id;
      // provjera da li je user logovan
      if (!loginStatus)
      {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
      switch (destination)
      {
        case '/products':
        case '/products/' + productId:
        {
            if (localStorage.getItem("userRole") === "Customer" || localStorage.getItem("userRole") === "Admin" || localStorage.getItem("userRole") === "Moderator")
            {
              return true;
            }
        }
        case '/products/update':
        {
            if (localStorage.getItem("userRole") === "Customer" || localStorage.getItem("userRole") === "Moderator")
            {
              this.router.navigate(['/access-denied']);
            }
            if (localStorage.getItem("userRole") === "Customer" || localStorage.getItem("userRole") === "Moderator")
            {
              this.router.navigate(['/access-denied']);
              return false;
            }
            if (localStorage.getItem("userRole") === "Admin")
            {
              return true;
            }
         }
        default:
          return false;
      }
      // ako je korisnik vec logovan
      return false;
    }))
  }
}
