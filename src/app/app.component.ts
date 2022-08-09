import { Component } from '@angular/core';
import { UserListComponent } from './components/userList/userList.component'
import { CommentListComponent } from './components/commentList/commentList.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  userListEnabled: boolean = false;
  comment: String = "";
  comments: String[] = [];

  submitComment() {
    this.comments.push(this.comment);
    this.comment = "";
  }

  title = 'tagger';
}
