import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UserInvitationComponent } from './user-invitation/user-invitation.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AccountComponent,
                children: [
                    { path: 'login', component: LoginComponent },
                    { path: 'register', component: RegisterComponent },
                    { path: 'forgot-password', component: ForgotPasswordComponent, data: { title: 'Forgot Password' }  },
                    { path: 'reset-password', component: ResetPasswordComponent, data: { title: 'Reset Password' }  },
                    { path: 'user-invitation', component: UserInvitationComponent, data: { title: 'User Invitation' }  }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AccountRoutingModule { }
