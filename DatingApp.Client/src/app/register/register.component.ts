import { Component, EventEmitter, inject, input, OnInit, Output, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';
import { TextInputComponent } from "../_forms/text-input/text-input.component";
import { DatePickerComponent } from "../_forms/date-picker/date-picker.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, TextInputComponent, DatePickerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

accountService = inject(AccountService);
cancelEvent = output<boolean>();
private toastr = inject(ToastrService);
registerForm: FormGroup = new FormGroup({});
private fb = inject(FormBuilder);
maxDate = new Date();
private router = inject(Router);
validationErrors: string[] | undefined;

ngOnInit(): void {
  this.InitializeForm();
  this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
}

InitializeForm(){
  this.registerForm = this.fb.group({
    gender: ['male'],
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
    knownAs: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    confirmPassword: ['', [Validators.required, this.matchValues('password')]]
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
  const dob = this.getDateOnly(this.registerForm.get('dateOfBirth')?.value);
  this.registerForm.patchValue({dateOfBirth: dob});
  this.accountService.register(this.registerForm.value).subscribe({
    next: _ => this.router.navigateByUrl('/members'),
    error: error => this.validationErrors = error,
    complete: () => this.toastr.success("registered")
  })
}

cancel(){
  this.cancelEvent.emit(false);
}

private getDateOnly(dob: string | undefined){
  if(!dob) return;
  return new Date(dob).toISOString().slice(0,10);
}
}
