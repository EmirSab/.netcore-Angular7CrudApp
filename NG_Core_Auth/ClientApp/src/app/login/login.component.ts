import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // 26. Kreiranje servisa za account, kreiranje propertija za status logina
  private loginStatusGet: boolean;
  //29. Kreiranje login funkcionalnosti
  
  insertForm: FormGroup; // formgroupe je form elemenat i sadrzaj
  Username: FormControl; // formcontrol je jedna samo kontrola
  Password: FormControl;
  returnUrl: string;
  ErrorMessage: string;
  invalidLogin: boolean;
  constructor(private acct: AccountService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder) { }

  // 30. Kreiranje onSubmit buttona ->login.component.html
  // prvo se mora angularu reci koja je forma je angular forma u html
  // uzimanje vrijednosti formgrupe
  onSubmit(){
    let userLogin = this.insertForm.value;
    this.acct.login(userLogin.Username, userLogin.Password).subscribe(result => {
      let token = (<any>result).token;
      console.log(token);
      console.log(result.userRole);
      this.invalidLogin = false;
      console.log("User Logged in successufully");
      console.log(this.returnUrl);
      this.router.navigateByUrl(this.returnUrl);
    }, error => {
      this.invalidLogin = true;
      this.ErrorMessage = error.error.loginError;
      console.log(this.ErrorMessage);
      });

  }

  ngOnInit() {
    //this.loginStatusGet = this.acct.loginStatus;
    // 29.1 inicijalizacija varijabli u ngOnInit
    this.Username = new FormControl('', [Validators.required]);
    this.Password = new FormControl('', [Validators.required]);
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.insertForm = this.fb.group({
      "Username": this.Username,
      "Password": this.Password
    });
  }

}
