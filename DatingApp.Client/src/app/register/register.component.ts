import { Component, EventEmitter, inject, input, Output, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';

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

register(){
  this.accountService.register(this.model).subscribe({
    next: res => {
      console.log(res);
      this.cancel();
    },
    error: error => console.log(error),
    complete: () => console.log("completed")
  })
}

cancel(){
  this.cancelEvent.emit(false);
}
}
