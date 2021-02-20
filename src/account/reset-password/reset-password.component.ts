import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { TokenAuthServiceProxy, ResetPasswordModel } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent extends AppComponentBase implements OnInit {

  logoName: string;
  imageName: string;
  showNewPassword = false;
  showConfirmPassword = false;

  submitting = false;
  public imgSrc: string;
  useSvg: boolean;
  userNameOrEmailAddress = '';
  resetModel = new ResetPasswordModel();

  constructor(
    injector: Injector,
    public _tokenAuthService: TokenAuthServiceProxy,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {
    super(injector);
    this.imgSrc = 'assets/img/logo.png';
  }

  ngOnInit(): void {
    this._activatedRoute.queryParamMap.subscribe(params => {
      this.resetModel.userId = Number.parseInt(params.get('id'));
      this.resetModel.resetToken = params.get('token');
      if (!this.resetModel.userId || !this.resetModel.resetToken) {
        this._router.navigate(['account/login']);
      }
      this._tokenAuthService
        .verifyResetPasswordToken(this.resetModel)
        .subscribe((result: any) => {
          this.userNameOrEmailAddress = result;
        }, (error: any) => {
          this._router.navigate(['account/login']);
        });
    });
  }

  reset() {
    this.submitting = true;
    this._tokenAuthService
      .resetPassword(this.resetModel)
      .pipe(finalize(() => { this.submitting = false; }))
      .subscribe((result: any) => {
        this._router.navigate(['account/login']);
      });
  }

}
