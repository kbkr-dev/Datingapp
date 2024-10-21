import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LikesService } from '../_services/likes.service';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { MembersCardComponent } from "../members/members-card/members-card.component";
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PaginatedResult } from '../_models/pagination';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [ButtonsModule, FormsModule, MembersCardComponent, PaginationModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent implements OnInit, OnDestroy {

  likeService = inject(LikesService);
  predicate = 'liked';
  pageNumer = 1;
  pageSize  = 5;

  ngOnInit(): void{
    this.loadLikes();
  }

  getTitile(){
    switch(this.predicate){
      case 'liked': return 'Members you like';
      case 'likedBy': return 'Members who like you';
      default: return 'Mutual';
    }
  }

  loadLikes(){
    this.likeService.getLikes(this.predicate, this.pageNumer, this.pageSize);
  }

  pageChanged(event: any){
    if(this.pageNumer !== event.page){
      this.pageNumer = event.page;
      this.loadLikes();
    }
  }

  ngOnDestroy(): void {
    this.likeService.paginatedResult.set(null);
  }
}
