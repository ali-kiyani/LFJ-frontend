import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { AppConsts } from '@shared/AppConsts';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ForgotPasswordModel, TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent extends AppComponentBase implements OnInit {

  logoName: string;
  imageName: string;

  submitting = false;
  public imgSrc: string;
  useSvg: boolean;
  userNameOrEmailAddress = '';
  forgotModel = new ForgotPasswordModel();

  constructor(
    injector: Injector,
    public _tokenAuthService: TokenAuthServiceProxy,
    private _router: Router,
  ) {
    super(injector);
    this.imgSrc = 'assets/img/logo.png';
  }

  ngOnInit(): void {
  }

  forgot() {
    this.submitting = true;
    this._tokenAuthService
      .forgotPassword(this.forgotModel)
      .pipe(finalize(() => { this.submitting = false; }))
      .subscribe((result: any) => {
        abp.notify.success(this.l('Password reset link sent successfully!'));
      });
  }
}
