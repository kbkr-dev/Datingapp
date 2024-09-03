import { Component, inject, OnInit } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  ngOnInit(): void {
    this.getUsers();
  }

  http = inject(HttpClient);
  registerMode = false;
  users: any;

  registerToggle(){
    this.registerMode = !this.registerMode;
  }

getUsers(){
  this.http.get('https://localhost:7019/api/Users').subscribe({
    next: response => {
      this.users = response;
      console.log(this.users);
    },
    error: error => console.log(error),
    complete: () => console.log("request complete")
  });
}

onCancelEvent(event: boolean){
  console.log("cancel event called", event);
  this.registerMode = event;
}
}
