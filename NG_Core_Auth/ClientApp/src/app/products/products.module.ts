import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductListComponent } from './product-list/product-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { JwtInterceptor } from '../_helpers/jwt.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuardService } from '../guards/auth-guard.service';
// 49.2 dodati route za product ->
// dodati productlist i detail u deklarations
@NgModule({
  declarations: [
    ProductDetailsComponent,
    ProductListComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // 52.3 Editing Angular DataTable UI to Load Product Data, importovanje u products.module.ts ->product-list.component.ts
    DataTablesModule
  ],
  //58.1 Testing JWT Interceptor Class With Products List Component 
  providers: [
    AuthGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ]
})
export class ProductsModule { }
