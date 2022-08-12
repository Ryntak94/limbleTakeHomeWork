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
  public hovered : number | null = null;

  constructor(private commentService: CommentService) {}

  @HostListener('wheel', ['$event'])
  scrollHandler(event: any)  {
    event.preventDefault();
    if(event.deltaY < 0) {
      this.upHandler(event)
    } else {
      this.downHandler(event)
    }
  }


  @HostListener('document:keydown', ['$event'])
  keydownHandler(event: any)  {
    if(event.key === "Escape")  {
      this.commentService.cancelTag();
    } else if(event.key === "Enter")  {
      event.preventDefault()
      this.commentService.selectUser(this.users[this.selected]);
      
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateList();
  }

  ngOnDestroy() {
    this.commentService.selectUser(this.displayedUsers![this.hovered!]);
  }

  hoverHandler(event: any)  {
    this.hovered = event.currentTarget.id;
    
  }

  updateList()  {
    if(this.users.length < 5) {
      this.displayedRange = [0, 5]
      this.displayedSelected = this.selected;
    }
      this.displayedUsers = this.users.slice(this.displayedRange[0], this.displayedRange[1]);
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
