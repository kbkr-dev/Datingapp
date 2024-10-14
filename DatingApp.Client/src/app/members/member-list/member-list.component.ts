import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { MembersCardComponent } from "../members-card/members-card.component";
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MembersCardComponent, PaginationModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {
  public memberService = inject(MembersService);
  pageNumber = 1;
  pageSize = 10;
  ngOnInit(): void {
    if(!this.memberService.paginatedResult()) this.loadMembers();
  }

  loadMembers(){
    this.memberService.getMembers(this.pageNumber, this.pageSize);
  }

}
