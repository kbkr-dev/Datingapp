import { Component, EventEmitter, inject, input, Output, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
model: any = {};
accountService = inject(AccountService);
cancelEvent = output<boolean>();
private toastr = inject(ToastrService);

register(){
  this.accountService.register(this.model).subscribe({
    next: res => {
      console.log(res);
      this.cancel();
    },
    error: error => this.toastr.error(error.error),
    complete: () => this.toastr.success("registered")
  })
}

cancel(){
  this.cancelEvent.emit(false);
}
}
