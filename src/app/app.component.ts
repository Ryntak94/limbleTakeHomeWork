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
  users: User[] = [
    {id: 1, name: 'Kevin'},
    {id: 2, name: 'Jeff'},
    {id: 3, name: 'Bryan'},
    {id: 4, name: 'Gabbey'}
  ];

  submitComment() {
    this.comments.push(this.comment);
    this.comment = "";
  }

  taggingUser(event: any) {
    this.comment = event.target.value;
    let caretPosition: number = event.target.selectionStart;
    let tags: string[] | null = this.comment.match(/(\@[^\@])\w+/g);
    let indices: number[][] = [];
    
    if(tags !== null) {
      indices = tags.map(match =>  {
        let startIdx = this.comment.indexOf(match)
        let endIdx = startIdx + match.length;
        console.log(match.slice(0, endIdx - startIdx))
        return [startIdx, endIdx];
      })
    }

    for(let range of indices) {
      let startIdx = range[0];
      let endIdx = range[1];
      if(startIdx < caretPosition && caretPosition <= endIdx) {
        console.log(range)
        break;
      }
    }

    console.log(indices)
  }

  title = 'tagger';
}
