import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProxyAuthentService, LoginData } from '../../core/services/proxy/proxy-authent/proxy-authent.service';
import { ErrorAreaItem } from '../../shared/error-area/error-area.component';
import { MainToolbarService } from 'src/app/shared/main-toolbar/main-toolbar.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  constructor(
    private proxyAuthentService: ProxyAuthentService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private mainToolbarService: MainToolbarService,
    ) { }

  isLoading = false;

  errors: ErrorAreaItem[] = [];

  ngOnInit() {
    this.mainToolbarService.setMainTitle('login.mainTitle');
    this.form = this.generateForm();
  }

  login() {
    if (this.form.valid) {
      this.errors = [];
      this.isLoading = true;
      const loginData = this.form.getRawValue() as LoginData;
      this.proxyAuthentService.login(loginData).subscribe(
        () => {
          this.router.navigate(['..', 'private', 'browser'], {relativeTo: this.route});
          this.isLoading = false;
        } ,
        err => {
          this.isLoading = false;
          if (err.status === 401) {
            this.errors.push({id: 1, message: 'Invalid login or password'});
          }
      });
    }
  }

  private generateForm(): FormGroup {
    return this.fb.group({
      login: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }
}
