import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';
import { shareReplay, flatMap, first } from 'rxjs/operators';
import { htmlAstToRender3Ast } from '@angular/compiler/src/render3/r3_template_transform';


@Injectable({
  providedIn: 'root'
})
// 45.1 ProductService | Product Interface -> nav-menu.component.ts
export class ProductService {

  constructor(private http: HttpClient) { }
  private baseUrl: string = "/api/product/getproducts";
  private productUrl: string = "/api/product/addproduct";
  private deleteUrl: string = "/api/product/deleteproduct/";
  private updateUrl: string = "/api/product/updateproduct/";
  private product$: Observable<Product[]>


  // crud metode
  getProducts(): Observable<Product[]> {
    if (!this.product$) {
      this.product$ = this.http.get<Product[]>(this.baseUrl).pipe(shareReplay());
    }
    return this.product$;
  }
  getProductById(id: number): Observable<Product> {
    return this.getProducts().pipe(flatMap(result => result), first(product => product.productId == id));
  }
  insertProduct(newProduct: Product): Observable<Product> {
    return this.http.post<Product>(this.productUrl, newProduct);
  }
  updateProduct(id: number, editProduct: Product): Observable<Product> {
    return this.http.put<Product>(this.updateUrl + id, editProduct);
  }
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(this.deleteUrl + id);
  }

  // ciscsenje kesa
  clearCache() {
    this.product$ = null;
  }
}
