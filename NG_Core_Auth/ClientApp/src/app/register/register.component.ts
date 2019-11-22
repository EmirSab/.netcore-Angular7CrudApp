import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';
import { Key } from 'protractor';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { fail } from 'assert';
// 31.2 Pravljenje registracijske komponente, pravljenje formgrup objekta i dodavanje propertija ->app.module.ts
// 32 Kreiranje registracijske komponente, modali i ispravljenje greski, i custom validatora

// 33.2 Dodavanje ngx-bootstrapa za modale, dodavanje dependencija -> register.component.html
// BsModalService, BsModalRef


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private acct: AccountService,
              private router: Router,
              private modalService: BsModalService) { }
  insertForm: FormGroup;
  username: FormControl;
  password: FormControl;
  cpassword: FormControl;
  email: FormControl;
  modalRef: BsModalRef;
  errorList: string[];
  // 38.1 Displaying Registration Errors on Modal Popup, modal poruka ->register.component.html
  modalMessage: string;

  //33.4 Dodavanje ngx-bootstrapa za modale, manipulisanje podacima u templatu koristenjem viewchild ->nav-menu.component.ts
  openModal(template: TemplateRef<any>) {
    // 34.1 Registracijski metod
    // objekat koji se sadrzavati detalje usera
    let userDetails = this.insertForm.value;
    this.acct.register(userDetails.username, userDetails.password, userDetails.email).subscribe(result => {
      // handlanje responsa, ako je uspjesno
      this.router.navigate(['/login']);
    }, // handlanje responsa ako je error
      error => {
        // 38 Displaying Registration Errors on Modal Popup
        // inicijalizacija arraya na praznu vrijednost u slucaju da korisnik ispravi prethodnu gresku i ponovo klikne
        this.errorList = [];
        for (var i = 0; i < error.error.value.length; i++) {
          this.errorList.push(error.error.value[i]);
          //console.log(error.error.value[i]);
        }
        console.log(error);
        this.modalMessage = "Your Registration was Unsuccessuful";
        this.modalRef = this.modalService.show(template);
      }
    );
  }

 /* onSubmit() {
    this.modalRef = this.modalService.show(this.modal);
  }*/

  // custom validator
  MustMatch(passwordControl: AbstractControl) : ValidatorFn{
    return (cpasswordContol: AbstractControl): { [key: string]: boolean } | null => {
      if (!passwordControl && !cpasswordContol) {
        return null;
      }
      if (cpasswordContol.hasError && !passwordControl.hasError) {
        return null;
      }
      if (passwordControl.value !== cpasswordContol.value) {
        return {'Must match': true};
      }
      else {
        return null;
      }
    }
  }

  ngOnInit() {
    this.username = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(5)]);
    this.password = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(5)]);
    this.cpassword = new FormControl('', [Validators.required, this.MustMatch(this.password)]);
    this.email = new FormControl('', [Validators.required]);
    this.errorList = []; // inicijalizira se na prazan nis da ne bi prikazivalo prethodne greske
    // 33 Inicijalizacija form grupe -> register.component.html
    this.insertForm = this.fb.group(
      {
        'username': this.username,
        'password': this.password,
        'cpassword': this.cpassword,
        'email': this.email
      }
    );
  }

}
