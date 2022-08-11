import { Component, HostListener, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { UserComponent } from '../user/user.component';
import { User } from 'src/app/types/User';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-userList',
  templateUrl: './userList.component.html',
  styleUrls: ['./userList.component.css']
})

export class UserListComponent implements OnChanges {
  @Input() users: User[] = [];
  public displayedUsers?: User[];
  public selected: number = 0;
  public displayedSelected: number = 0;
  public displayedRange: number[] = [0,5]
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
    "ArrowLeft",
    "Insert"
  ]

  constructor(private commentService: CommentService) {

  }

  @HostListener('wheel', ['$event'])
  scrollHandler(event: any)  {
    event.preventDefault();
    console.log(event.deltaY);
    if(event.deltaY < 0) {
      this.upHandler(event)
    } else {
      this.downHandler(event)
    }
  }


  @HostListener('document:keydown', ['$event'])
  keydownHandler(event: any)  {
    if(event.key === "ArrowUp") {
      this.upHandler(event)
    } else if(event.key === "ArrowDown")  {
      this.downHandler(event)
    } else if(event.key === "Enter" || event.key === "ArrowRight" || event.key === "Tab")  {
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
  ngOnChanges(changes: SimpleChanges) {
    this.updateList();
  }

  updateList()  {
    if(this.users.length < 5) {
      this.displayedRange = [0, 5]
      this.displayedSelected = this.selected
    }
      this.displayedUsers = this.users.slice(this.displayedRange[0], this.displayedRange[1]);
  }

  tagUser(event: any) {
    let userIndx = event.currentTarget.id
    this.commentService.selectUser(this.users[userIndx]);
  }

  upHandler(event: any)  {
    event.preventDefault()
    if(this.selected === 0) {
      this.displayedSelected = 4
      this.selected = this.users.length - 1;
      this.displayedRange = [this.users.length - 5, this.users.length]
    } else {
      this.selected--;
      if(this.displayedSelected === 0)  {
        this.displayedRange[0]--
        this.displayedRange[1]--
      } else {
        this.displayedSelected--;
      }
    }
    this.updateList()
  }

  downHandler(event: any) {
    event.preventDefault()
    if(this.selected === this.users.length - 1) {
      this.displayedSelected = 0
      this.selected = 0;
      this.displayedRange = [0, 5]
    } else {
      this.selected++;
      if(this.displayedSelected === 4)  {
        this.displayedRange[0]++
        this.displayedRange[1]++
      } else {
        this.displayedSelected++;
      }
    }
    this.updateList()
  }
}
