import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DataTablesModule } from 'angular-datatables';
import { AccessDeniedComponent } from './errors/access-denied/access-denied.component';
// 57.1 Creating the JWT Interceptor Class To Attach Token To HTTP Request
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { AuthGuardService } from './guards/auth-guard.service';
import * as $ from "jquery";

//import { ProductDetailsComponent } from './products/product-details/product-details.component';
//import { ProductListComponent } from './products/product-list/product-list.component';
//22. Dodavanje routaModula ->app-routing.module.ts
// 30.3 Kreiranje onSubmit buttona ->login.component.html
// ubaciti FormsModule, ReactiveFormsModule
// ubaciti HttpClientModule

//47.1 Designing Product List Component ->
// sklonuti nepotrebne komponente
@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AccessDeniedComponent
    // 49.1 dodati route za product ->product.module.ts
    // izbrisati zato sto ovaj folder nije vise odgovoran za routanje ova dva elementa
    //ProductDetailsComponent,
    //ProductListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // 33.1 Dodavanje ngx-bootstrapa za modale -> registration.component.ts
    ModalModule.forRoot(),
    // 52.2 Editing Angular DataTable UI to Load Product Data, importovanje datatables modula -> products.module.ts
    DataTablesModule
  ],
  providers: [
    //58 Testing JWT Interceptor Class With Products List Component ->product.module.ts
    AuthGuardService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
