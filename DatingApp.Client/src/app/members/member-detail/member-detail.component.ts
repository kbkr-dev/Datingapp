import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../_models/member';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';
import { MemberMessagesComponent } from "../member-messages/member-messages.component";
import { Message } from '../../_models/message';
import { MessageService } from '../../_services/message.service';
import { PresenceService } from '../../_services/presence.service';
import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule, TimeagoModule, DatePipe, MemberMessagesComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', {static:true}) memberTabs?: TabsetComponent;
presenceService = inject(PresenceService);
private messageService = inject(MessageService);
private route = inject(ActivatedRoute);
private accountService = inject(AccountService);


member: Member = {} as Member;
images: GalleryItem[] = [];
activeTab? : TabDirective;

onTabActivated(data: TabDirective){
  this.activeTab = data;
  if(this.activeTab.heading === 'Messages' && this.member){
    const user = this.accountService.currentUser();
    if(!user) return;
    this.messageService.createHubConnection(user, this.member.userName);
  }
  else{
    this.messageService.stopHubConnection();
  }
}

selectTab(heading: string){
  if(this.memberTabs){
    const messageTab = this.memberTabs.tabs.find(x => x.heading === heading);
    if(messageTab) messageTab.active = true;
  }
}

ngOnInit(): void {
this.route.data.subscribe({
  next: data => {
    this.member = data['member'];
    console.log("member is");
    console.log(data);
    this.member && this.member.photos.map(p => {
      this.images.push(new ImageItem({src: p.url, thumb: p.url}))
    });
  }
});


  this.route.queryParams.subscribe({
    next: params => {
      params['tab'] && this.selectTab(params['tab'])
    }
  });
}

ngOnDestroy(): void {
  this.messageService.stopHubConnection();
}
}
