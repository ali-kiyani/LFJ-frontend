import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { AccountServiceProxy, RegisterInvitedInput, RegisterOutput, TokenAuthServiceProxy, VerifyInvitedUserModel } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
  templateUrl: './user-invitation.component.html',
  animations: [accountModuleAnimation()]
})
export class UserInvitationComponent extends AppComponentBase implements OnInit {

  model: RegisterInvitedInput = new RegisterInvitedInput();
  verifyModel: VerifyInvitedUserModel = new VerifyInvitedUserModel();
  saving = false;
  email: string;
  usernameExists = false;

  constructor(injector: Injector,
    private _accountService: AccountServiceProxy,
    private _router: Router,
    public _tokenAuthService: TokenAuthServiceProxy,
    private _activatedRoute: ActivatedRoute,
    private authService: AppAuthService) {
      super(injector);
     }

  ngOnInit(): void {
    this._activatedRoute.queryParamMap.subscribe(params => {
      this.verifyModel.id = Number.parseInt(params.get('id'));
      this.verifyModel.email = params.get('email');
      if (!this.verifyModel.id || !this.verifyModel.email) {
        this._router.navigate(['account/login']);
      }
      this._tokenAuthService
        .verifyInvitationEmail(this.verifyModel)
        .subscribe((result: any) => {
          this.model.emailAddress = this.verifyModel.email;
        }, (error: any) => {
          this._router.navigate(['account/login']);
        });
    });
  }

  verifyAndSave() {
    this.saving = true;
    this._accountService.verifyUsernameExist(this.model.userName).subscribe(result => {
      if (result == true) {
        this.usernameExists = true;
      } else {
        this.save();
      }
    });
  }

  save() {
    this._accountService
      .registerInvited(this.model)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe((result: RegisterOutput) => {
        if (!result.canLogin) {
          this.notify.success(this.l('SuccessfullyRegistered'));
          this._router.navigate(['/login']);
          return;
        }

        // Autheticate
        this.saving = true;
        this.authService.authenticateModel.userNameOrEmailAddress = this.model.userName;
        this.authService.authenticateModel.password = this.model.password;
        this.authService.authenticate(() => {
          this.saving = false;
        });
      });
  }
}
