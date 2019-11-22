import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccessDeniedComponent } from './errors/access-denied/access-denied.component';
//22.1 Dodavanje routaModula, setovanje ruta -> app.component.html

const routes: Routes = [];
@NgModule({
  imports: [RouterModule.forRoot([
    { path: "home", component: HomeComponent },
    { path: "", component: HomeComponent, pathMatch: 'full' },
    // 49 dodati route za product ->app.module.ts
    {path:'products', loadChildren:'./products/products.module#ProductsModule'},
    // 25.1 Dodoavanje routa za login komponentu -> styles.css dodati css za login
    { path: 'login', component: LoginComponent },
    // 31 . Pravljenje registracijske komponente, -> registration.component.html
    { path: 'register', component: RegisterComponent },
    // 55 Creating Access Denied Component, dodavanje patha za komponentu ->access-denied.component.ts
    {path: 'access-denied', component: AccessDeniedComponent},
    { path: '**', redirectTo: '/home' }

  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
