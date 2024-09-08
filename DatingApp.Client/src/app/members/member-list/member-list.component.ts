import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { Member } from '../../_models/member';
import { ToastrService } from 'ngx-toastr';
import { MembersCardComponent } from "../members-card/members-card.component";

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MembersCardComponent],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {
  private memberService = inject(MembersService);
  private toastr = inject(ToastrService);
  members: Member[] = [];
  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(){
    this.memberService.getMembers().subscribe({
      next: res => this.members = res,
      error: error => this.toastr.error("Members loading failed", error)
    })
  }

}
