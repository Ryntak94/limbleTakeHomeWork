import { Component, Input } from '@angular/core';
import { UserComponent } from '../user/user.component';
import { User } from 'src/app/types/User';

@Component({
  selector: 'app-userList',
  templateUrl: './userList.component.html',
  styleUrls: ['./userList.component.css']
})

export class UserListComponent {
  @Input() enabled?: boolean;
  users: User[] = [
    {id: 1, name: 'Kevin'},
    {id: 2, name: 'Jeff'},
    {id: 3, name: 'Bryan'},
    {id: 4, name: 'Gabbey'}
  ];
  filteredUsers: User[] = this.users;
}
