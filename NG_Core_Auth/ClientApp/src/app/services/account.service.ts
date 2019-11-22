import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Local } from 'protractor/built/driverProviders';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

// 26. Kreiranje servisa za account -> login.component.ts
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient, private router: Router) { }
  private baseUrl: string = "/api/account/login";
  private baseUrlRegister: string = "/api/account/register";

  // 27. dodavanje behaviour s bjecta i kodiranje login metoda
  private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
  private UserName = new BehaviorSubject<string>(localStorage.getItem('username'));
  private UserRole = new BehaviorSubject<string>(localStorage.getItem('userRole'));

  // 34 Registracijski metod -> register.component.ts
  register(username: string, password: string, email: string) {
    // prosljedjivanje vrijednosti
    return this.http.post<any>(this.baseUrlRegister, { username, password, email }).pipe(
      // pozivanje map metode koja sluzi za manipulaciju podacima
      map(result => {
        // uspjesna registracija
        return result;
      }, error => {
        return error;
        }));
  }

  // login metod
  login(username: string, password: string)
  {
    return this.http.post<any>(this.baseUrl, { username, password }).pipe(
      // 28. handlanje responsa u pipe
      //pipe let you combine multiple functions into a single function
      //pipe runs the composed function in sequence
      // dodati router module
      map(result => {
        //uspjesno logovan ako postoji token u reponsu
        if (result && result.token)
        {
          // sacuvati userove informacije u localstorage
          this.loginStatus.next(true);
          localStorage.setItem('loginStatus', '1');
          localStorage.setItem('jwt', result.token);
          localStorage.setItem('username', result.username);
          localStorage.setItem('expiration', result.expiration);
          localStorage.setItem('userRole', result.userRole);
          // 43.1 Sending Registration Confirmation Email Using SendGrid - 5
          this.UserName.next(localStorage.getItem('username'));
          this.UserRole.next(localStorage.getItem('userrole'));
        }
        return result;
      })
    );
  }

  logout()
  {
    this.loginStatus.next(false);
    localStorage.removeItem('jwt');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('expiration');
    localStorage.setItem('loginStatus', '0 ');
    this.router.navigate(['/login']);
    console.log("Looged out successufully");
  }

 
  checkLoginStatus(): boolean {

    //62  ispravka validacije jwt tokena -> product-list.component.ts
    var loginCookie = localStorage.getItem("loginStatus");

    if (loginCookie == "1") {
      if (localStorage.getItem('jwt') === null || localStorage.getItem('jwt') === undefined) {
        return false;
      }

      // Get and Decode the Token
      const token = localStorage.getItem('jwt');
      const decoded = jwt_decode(token);
      // Check if the cookie is valid

      if (decoded.exp === undefined) {
        return false;
      }

      // Get Current Date Time
      const date = new Date(0);

      // Convert EXp Time to UTC
      let tokenExpDate = date.setUTCSeconds(decoded.exp);

      // If Value of Token time greter than 

      if (tokenExpDate.valueOf() > new Date().valueOf()) {
        return true;
      }

      console.log("NEW DATE " + new Date().valueOf());
      console.log("Token DATE " + tokenExpDate.valueOf());

      return false;

    }
    return false;
  }

  // 28.1 da ostali djelovi appa mogu vidjeti propertije koji su pod private ->login.component.ts
  get isLoggedIn()
  {
    return this.loginStatus.asObservable();
  }
  get currentUsername()
  {
    return this.UserName.asObservable();
  }

  get currentUserRole()
  {
    return this.UserRole.asObservable();
  }

}


