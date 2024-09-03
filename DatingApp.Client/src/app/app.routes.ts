import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { authGuard } from './_gaurds/auth.guard';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            {path: 'members', component: MemberListComponent, canActivate: [authGuard]},
            {path: 'members/:id', component: MemberDetailComponent, canActivate: [authGuard]},
            {path: 'lists', component: ListsComponent, canActivate: [authGuard]},
            {path: 'messages', component: MessagesComponent, canActivate: [authGuard]}
        ]
    },    
    {path: '**', component: HomeComponent, pathMatch: "full"}
];
