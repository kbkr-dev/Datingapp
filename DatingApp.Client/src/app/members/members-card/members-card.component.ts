import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../_models/member';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../_services/likes.service';
import { PresenceService } from '../../_services/presence.service';

@Component({
  selector: 'app-members-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './members-card.component.html',
  styleUrl: './members-card.component.css'
})
export class MembersCardComponent {
  private likeService = inject(LikesService);
  private presenceService = inject(PresenceService);
  member = input.required<Member>();
  
  hasLiked = computed(() => {
    return this.likeService.likeIds().includes(this.member().id);
  });
  isOnline = computed(() => this.presenceService.onlineUsers().includes(this.member().userName));

  toggleLike(){
    this.likeService.toggleLike(this.member().id).subscribe({
      next: () => {
        if(this.hasLiked()){
          this.likeService.likeIds.update(ids => ids.filter(x => x !== this.member().id));
        }
        else{
          this.likeService.likeIds.update(ids => [...ids, this.member().id]);
        }
      }
    })
  }
}
