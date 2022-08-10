import { Component, HostListener, Input } from '@angular/core';
import { UserComponent } from '../user/user.component';
import { User } from 'src/app/types/User';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-userList',
  templateUrl: './userList.component.html',
  styleUrls: ['./userList.component.css']
})

export class UserListComponent {
  @Input() users: User[] = [];
  public selected: number = 0;
  public keysToIgnore: string[] = [
    "F1",
    "F2",
    "F3",
    "F4",
    "F6",
    "F7",
    "F8",
    "F9",
    "F10",
    "F11",
    "F12",
    "Scrolllock",
    "PageUp",
    "PageDown",
    "CapsLock",
    "Alt",
    "Control",
    "Pause",
    "Shift",
    "ContextMenu",
    "Meta",
    "Delete",
    "ArrowLeft"
  ]

  constructor(private commentService: CommentService) {}
  @HostListener('document:keydown', ['$event'])
  test(event: any)  {
    console.log(event)
    if(event.key === "ArrowUp") {
      event.preventDefault()
      this.selected !== 0 ? this.selected-- : this.selected = this.users.length - 1;
    } else if(event.key === "ArrowDown")  {
      event.preventDefault()
      this.selected !== this.users.length - 1 ? this.selected++ : this.selected = 0;
    } else if(event.key === "Enter" || event.key === "ArrowRight" || event.key === " " || event.key === "Tab")  {
      event.preventDefault()
      this.commentService.selectUser(this.users[this.selected]);
    } else  if(event.key === "Escape")  {
      this.commentService.cancelTag();
    } else if (this.keysToIgnore.includes(event.key))  {
      event.preventDefault();
    } else {
      console.log('here')
      this.commentService.updateComment(event)
    }
  }
}
