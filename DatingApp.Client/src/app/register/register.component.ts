import { Component, EventEmitter, inject, input, OnInit, Output, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { JsonPipe, NgIf } from '@angular/common';
import { TextInputComponent } from "../_forms/text-input/text-input.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, NgIf, TextInputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

model: any = {};
accountService = inject(AccountService);
cancelEvent = output<boolean>();
private toastr = inject(ToastrService);
registerForm: FormGroup = new FormGroup({});
private fb = inject(FormBuilder);

ngOnInit(): void {
  this.InitializeForm();
}

InitializeForm(){
  this.registerForm = new FormGroup({
    username: new FormControl('Hello', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
    confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')])
  });
  this.registerForm.controls['password'].valueChanges.subscribe({
    next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
  })
}

matchValues(matchTo: string): ValidatorFn{
  return (control: AbstractControl) => {
    return control.value == control.parent?.get(matchTo)?.value ? null : {isMatching: true}
  }
}

register(){
  console.log(this.registerForm.value);
  // this.accountService.register(this.model).subscribe({
  //   next: res => {
  //     console.log(res);
  //     this.cancel();
  //   },
  //   error: error => this.toastr.error(error.error),
  //   complete: () => this.toastr.success("registered")
  // })
}

cancel(){
  this.cancelEvent.emit(false);
}
}
