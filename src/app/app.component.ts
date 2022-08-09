import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserListComponent } from './components/userList/userList.component'
import { CommentListComponent } from './components/commentList/commentList.component';
import { User } from './types/User'
import { Trie } from './dataStructures/Trie';
import { CommentService } from './services/comment.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  userListEnabled: boolean = false;
  comment: string = "";
  comments: string[] = [];
  tag: string = "";
  tagIdx?: number;
  taggedUsers: User[] = [];
  users: User[] = [
    {id: 1, name: 'Kevin'},
    {id: 2, name: 'Jeff'},
    {id: 3, name: 'Bryan'},
    {id: 4, name: 'Gabbey'},
    {id: 5, name: 'Kerry'},
    {id: 6, name: 'Kaleia'},
    {id: 7, name: 'Ryan'},
    {id: 8, name: 'Ian'},
    {id: 9, name: 'Adam'}
  ]
  userTrie: Trie = new Trie(this.users);
  filteredUsers: User[] = this.users;

  @ViewChild("commentBox") commentBox?: ElementRef;

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    this.commentService.userSelected.subscribe(user =>  {
      this.comment = this.comment.slice(0, this.tagIdx) + this.comment.slice(this.tagIdx).replace(this.tag, `@${user.name}`)
      this.userListEnabled = false;
      this.commentBox?.nativeElement.focus();
      this.taggedUsers.push(user)
    })
  }

  submitComment() {
    this.comments.push(this.comment);
    this.comment = "";
    this.userListEnabled = false;
    this.taggedUsers = [];
  }

  onKeyHandler(event: any)  {
    if(event.keyCode === 38 || event.keyCode === 40 || event.keyCode === 13)  {
      if(this.userListEnabled)  {
        event.preventDefault();
      }
    } else {
      this.taggingUser(event);
    }
  }


  taggingUser(event: any) {

    this.comment = event.target.value;
    let caretPosition: number = event.target.selectionStart;
    let tags: string[] | null = this.comment.match(/\@[a-zA-Z]+/g);
    let indices: number[][] = [];
    let inRange: boolean = false;

    if(tags !== null) {
      let lastIdx: number = 0;
      console.log(tags)
      indices = tags.map(match =>  {
        console.log(this.comment.slice(lastIdx))
        let startIdx: number = this.comment.slice(lastIdx).indexOf(match) + lastIdx;
        let endIdx: number = startIdx + match.length;
        lastIdx = endIdx;
        return [startIdx, endIdx];
      })
    }

    for(let range of indices) {
      let [startIdx, endIdx] = range;
      
      if(startIdx < caretPosition && caretPosition <= endIdx) {
        console.log('here')
        this.tag = this.comment.slice(startIdx, endIdx);
        this.tagIdx = startIdx;
        inRange = true;
        this.filteredUsers = this.userTrie.filteredList(this.tag.slice(1))
        this.userListEnabled = true;
        break;
      }
    }

    if(!inRange) this.userListEnabled = false;
  }

  title = 'tagger';
}
