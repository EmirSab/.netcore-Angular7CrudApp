import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';
import { ProductService } from '../services/product.service';
// 20.1 Pravljenje nav menija -> app.component.html
@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  // 45.2 ProductService | Product Interface
  // dodati product service u konstruktor
  constructor(private acct: AccountService, private productService: ProductService) { }
  // 37 sakrivanje navbara od ljudi koji nisu logovani -> nav-menue.component.html
  // dobavljanje potrebnih propertija
  // dolar se stavlja za observable tipove
  LoginStatus$: Observable<boolean>;

  UserName$: Observable<string>;
  ngOnInit() {
    this.LoginStatus$ = this.acct.isLoggedIn;

    this.UserName$ = this.acct.currentUsername;
  }
  // 37.1 metod Logout
  onLogout() {
    // prvo ce se ocistiti cache kad se sljedeci put user loguje da se lista ponovo moze pozvati da ne bi imao staru listu
    this.productService.clearCache();
    this.acct.logout();
  }

}
