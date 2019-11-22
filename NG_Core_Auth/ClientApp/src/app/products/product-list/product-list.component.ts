import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Product } from 'src/app/interfaces/product';
import { Observable, Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  // 50 Creating Product List Component Properties ->product-list.component.html
  // properti za form kontrol i za dodavanje proizvoda
  insertForm: FormGroup;
  name: FormControl;
  price: FormControl;
  description: FormControl;
  imageUrl: FormControl;

  // properti za update producta
  updateForm: FormGroup;
  _name: FormControl;
  _price: FormControl;
  _description: FormControl;
  _imageUrl: FormControl;
  _id: FormControl;

  // add modal referenca
  @ViewChild('template', { static: true }) modal: TemplateRef<any>;

  // update modal
  @ViewChild('editTemplate', { static: true }) editmodal: TemplateRef<any>;

  // modal properties
  modalMessage: string;
  modalRef: BsModalRef;
  selectProduct: Product;
  products$: Observable<Product[]>;
  products: Product[] = [];
  userRoleStatus: string;


  //51  Installing Angular DataTables Packages
  // prvo instalirati jquery
  // npm install datatables.net --save
  // npm install datatables.net-dt --save
  // npm install angular-datatables --save
  //npm install @types/jquery --save-dev
  // npm install @types/datatables.net --save-dev
  // propertiji koji ce prikazivati listu produkata u tabeli
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, { static: true }) dtElement: DataTableDirective;

  // 63 CRUD Functionality - Add New Product - Part 1 ->product-list.component.html

  constructor(private productservise: ProductService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
      private acct: AccountService
  ) { }
  // 63.2 CRUD Functionality - Add New Product - Part 1, pravljenje metode za add
  onAddProduct() {
    this.modalRef = this.modalService.show(this.modal);
  }
  onSubmit() {
    let newProduct = this.insertForm.value;

    this.productservise.insertProduct(newProduct).subscribe(
      result => {
        this.productservise.clearCache();
        this.products$ = this.productservise.getProducts();

        this.products$.subscribe(newlist => {
          this.products = newlist;
          this.modalRef.hide();
          this.insertForm.reset();
          this.rerender();

        });
        console.log("New Product added");

      },
      error => console.log('Could not add Product')

    )
  }
  // We will use this method to destroy old table and re-render new table
  // 64 How to Detect Changes And Re-Render DataTables, rerenderovanje tabele
  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first in the current context
      dtInstance.destroy();

      // Call the dtTrigger to rerender again
      this.dtTrigger.next();

    });
  }
  // 65 CRUD Functionality - Updating Product Details
  onUpdate() {
    let editProduct = this.updateForm.value;
    console.log(editProduct);
    this.productservise.updateProduct(editProduct.id, editProduct).subscribe(
      result => {
        console.log('Product Updated');
        this.productservise.clearCache();
        this.products$ = this.productservise.getProducts();
        this.products$.subscribe(updatedlist => {
          this.products = updatedlist;

          this.modalRef.hide();
          this.rerender();
        });
      },
      error => console.log('Could Not Update Product')
    )
  }

  onUpdateModal(productEdit: Product): void {
    this._id.setValue(productEdit.productId);
    this._name.setValue(productEdit.name);
    this._price.setValue(productEdit.price);
    this._description.setValue(productEdit.description);
    this._imageUrl.setValue(productEdit.imageUrl);

    this.updateForm.setValue({
      'id': this._id.value,
      'name': this._name.value,
      'price': this._price.value,
      'description': this._description.value,
      'imageUrl': this._imageUrl.value,
      'outOfStock': true
    });

    this.modalRef = this.modalService.show(this.editmodal);
  }

  // 66 CRUD Functionality - Deleting Product, metod za delete ->product-list.component.html
  onDelete(product: Product) : void {
    this.productservise.deleteProduct(product.productId).subscribe
      (
      result => {
        this.productservise.clearCache();
        this.products$ = this.productservise.getProducts();
        this.products$.subscribe(newlist =>
        {
          this.products = newlist;
          this.rerender();
        })
      }

    );
  }

//67 CRUD Functionality - View product Details, onSelect -> product-detail.component.ts
  onSelect(product: Product): void {
    this.selectProduct = product;
    this.router.navigateByUrl("/products/" + product.productId);
  }
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      autoWidth: true,
      order: [[0, 'desc']]
    }
    // 52 Editing Angular DataTable UI to Load Product Data - product-list.component.html
    this.products$ = this.productservise.getProducts();
    this.products$.subscribe(result => {
      this.products = result;
      // 64.1 How to Detect Changes And Re-Render DataTables, rerenderovanje tabele
      // za detektovanje promjena
      this.chRef.detectChanges();

      //lodanje produkata u tabelu
      this.dtTrigger.next();
    });
    //69 Limiting CRUD Functionality to Admin User Role Only, inicijalizacija
    this.acct.currentUserRole.subscribe(result =>
    {
      this.userRoleStatus = result;
    });
    // 63.3 CRUD Functionality - Add New Product - Part 1, poruka i inicijalizacija produkta
    this.modalMessage = "All fields are mandatory";
    let validateImageUrl: string = '^(https?:\/\/.*\.(?:png|jpg))$';
    this.name = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.price = new FormControl('', [Validators.required, Validators.min(0), Validators.max(10000)]);
    this.description = new FormControl('', [Validators.required, Validators.maxLength(150)]);
    this.imageUrl = new FormControl('', [Validators.pattern(validateImageUrl)]);

    this.insertForm = this.fb.group({
      'name': this.name,
      'price': this.price,
      'description': this.description,
      'imageUrl': this.imageUrl,
      'outOfStock': true,
    });

    // 65.1 CRUD Functionality - Updating Product Details, inicijalizacija update propertija
    this._name = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this._price = new FormControl('', [Validators.required, Validators.min(0), Validators.max(10000)]);
    this._description = new FormControl('', [Validators.required, Validators.maxLength(150)]);
    this._imageUrl = new FormControl('', [Validators.pattern(validateImageUrl)]);
    this._id = new FormControl();
    //65.2 CRUD Functionality - Updating Product Details, dodavanje propertija u form builder
    this.updateForm = this.fb.group(
      {
        'id': this._id,
        'name': this._name,
        'price': this._price,
        'description': this._description,
        'imageUrl': this._imageUrl,
        'outOfStock': true,
      });
  }
  // 64.2 How to Detect Changes And Re-Render DataTables, onDestroyMetod
  ngOnDestroy() {

    this.dtTrigger.unsubscribe();
  }
}
