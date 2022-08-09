import { Component } from '@angular/core';
import { UserListComponent } from './components/userList/userList.component'
import { CommentListComponent } from './components/commentList/commentList.component';
import { User } from './types/User'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  userListEnabled: boolean = false;
  comment: string = "";
  comments: string[] = [];
  tag: string = "";

  submitComment() {
    this.comments.push(this.comment);
    this.comment = "";
  }

  taggingUser(event: any) {
    this.comment = event.target.value;
    let caretPosition: number = event.target.selectionStart;
    let tags: string[] | null = this.comment.match(/(\@[^\@])\w+/g);
    let indices: number[][] = [];
    let inRange: boolean = false;
    
    if(tags !== null) {
      indices = tags.map(match =>  {
        let startIdx: number = this.comment.indexOf(match)
        let endIdx: number = startIdx + match.length;
        return [startIdx, endIdx];
      })
    }

    for(let range of indices) {
      let [startIdx, endIdx] = range;
      
      if(startIdx < caretPosition && caretPosition <= endIdx) {
        this.tag = this.comment.slice(startIdx, endIdx);
        inRange = true;
        this.userListEnabled = true;
        break;
      }
    }

    if(!inRange) this.userListEnabled = false;

    console.log(indices)
  }

  title = 'tagger';
}
