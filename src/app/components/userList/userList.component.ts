import { Component, Input } from '@angular/core';
import { UserComponent } from '../user/user.component';
import { User } from 'src/app/types/User';

@Component({
  selector: 'app-userList',
  templateUrl: './userList.component.html',
  styleUrls: ['./userList.component.css']
})

export class UserListComponent {
  @Input() users: User[] = [];
}
