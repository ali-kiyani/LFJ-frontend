import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { InviteUserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.css']
})
export class InviteUserComponent extends AppComponentBase implements OnInit {

  saving = false;
  user = new InviteUserDto();
  @Output() onSave = new EventEmitter<any>();
  duplicate = false;

  constructor(injector: Injector,
    public _userService: UserServiceProxy,
    public bsModalRef: BsModalRef) {
    super(injector);
  }

  ngOnInit(): void {
  }

  save() {
    this.saving = true;
    this._userService.inviteNewUser(this.user)
    .pipe(
      finalize(() => {
        this.saving = false;
      })
    ).subscribe((result) => {
      debugger;
      if(result.trim() === 'DuplicateEmail') {
        this.duplicate = true;
        return;
      }
      this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
    });
  }
}
