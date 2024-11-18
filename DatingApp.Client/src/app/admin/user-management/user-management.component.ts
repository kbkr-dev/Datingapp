import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { User } from '../../_models/user';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from '../../modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit{
  private adminService = inject(AdminService);
  private modalService = inject(BsModalService);
  users: User[] = [];
  bsmodalRef: BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>();
  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  openRolesModal(user: User){
    const initialState: ModalOptions = {
      class: 'modal-lg',
      initialState: {
        title: 'User roles',
        username: user.userName,
        selectedRoles: [...user.roles],
        availableRoles: ['Admin', 'Moderator', 'Member'],
        users: this.users,
        rolesUpdated: false
      }
    }
    this.bsmodalRef = this.modalService.show(RolesModalComponent, initialState);
    this.bsmodalRef.onHide?.subscribe({
      next: () => {
        if(this.bsmodalRef.content && this.bsmodalRef.content.rolesUpdated){
          const selectedRoles = this.bsmodalRef.content.selectedRoles;
          this.adminService.updateUserRoles(user.userName, selectedRoles).subscribe({
            next: roles => user.roles = roles
          })
        }
      }
    })
  }

  getUsersWithRoles(){
    this.adminService.getUserWithRoles().subscribe({
      next: res => {
        console.log(res);
        this.users = res;
      }
    });
  }

}
