import { Component } from '@angular/core';
import { UserListComponent } from './components/userList/userList.component'
import { CommentListComponent } from './components/commentList/commentList.component';
import { User } from './types/User'
import { Trie } from './dataStructures/Trie';

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
  users: User[] = [
    {id: 1, name: 'Kevin'},
    {id: 2, name: 'Jeff'},
    {id: 3, name: 'Bryan'},
    {id: 4, name: 'Gabbey'},
    {id: 5, name: 'Kerry'},
    {id: 6, name: 'Kaleia'},
    {id: 7, name: 'Ryan'},
    {id: 8, name: 'Ian'}
  ]
  userTrie: Trie = new Trie(this.users);
  filteredUsers: User[] = this.users;

  submitComment() {
    this.comments.push(this.comment);
    this.comment = "";
  }

  taggingUser(event: any) {
    
    this.comment = event.target.value;
    let caretPosition: number = event.target.selectionStart;
    let tags: string[] | null = this.comment.match(/\@[a-zA-Z]+/g);
    let indices: number[][] = [];
    let inRange: boolean = false;
    console.log(event.target.value)
    console.log(tags)
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
        this.filteredUsers = this.userTrie.filteredList(this.tag.slice(1))
        this.userListEnabled = true;
        console.log(this.filteredUsers)
        break;
      }
    }

    if(!inRange) this.userListEnabled = false;

    
  }

  title = 'tagger';
}
