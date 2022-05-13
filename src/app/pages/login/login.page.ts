import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../utils/services/authentication.service";
import {Platform} from "@ionic/angular";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  userForm: FormGroup;
  view = 'login';
  useBio: boolean;

  constructor(
    private authService: AuthenticationService,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.authService.isBioAvailable().then(res => this.useBio = res);
    this.userForm = new FormGroup({
      email: new FormControl('', [ Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)])
    });
    this.authService.loginBiometric().subscribe();
  }

  reset() {
    this.userForm.reset();
  }

  handleSubmit() {
    if(this.userForm.valid) {
      (this.view === 'login')? this.authenticate() : this.register();
    }
  }

  authenticate() {
      this.authService.login(this.userForm.value).subscribe();
  }

  register() {
      this.authService.register(this.userForm.value).subscribe();
  }

  bioLogin() {
    this.authService.loginBiometric().subscribe();
  }

}
