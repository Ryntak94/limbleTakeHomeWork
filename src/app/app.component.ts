import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserListComponent } from './components/userList/userList.component'
import { CommentListComponent } from './components/commentList/commentList.component';
import { User } from './types/User'
import { Trie } from './dataStructures/Trie';
import { CommentService } from './services/comment.service';
import { of } from 'rxjs';

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
      if(user) this.finalizeTag(user);
      this.userListEnabled = false;
      this.commentBox?.nativeElement.focus();
      this.taggedUsers.push(user)
    })

    this.commentService.emitUpdateComment.subscribe(event =>  {
      if(event.key === "Backspace") {
        let newTag = this.tag.slice(0, this.tag.length - 1);
        this.updateTag(newTag);
        this.tag = newTag;
        
      } else if(event.key ==="Home" || event.key === "End") {
        this.tag = "";
        this.tagIdx = 0;
        this.commentBox?.nativeElement.focus();
      } else {
        this.updateTag(this.tag + event.key);
        this.tag+= event.key
        console.log(event)

      }
      if(this.tag === "") {
       this.filteredUsers = [] 
      } else {
        this.filteredUsers = this.userTrie.filteredList(this.tag.slice(1))
      }
    })

    this.commentService.emitCancelTag.subscribe(event =>  {
      this.userListEnabled = false;
      this.commentBox?.nativeElement.focus();
      
      this.comment = this.comment.slice(0, this.tagIdx! + this.tag.length ) + " " + this.comment.slice(this.tagIdx! + this.tag.length)

    })

  }

  checkForTaggingUser(event: any) {

    this.comment = event.target.value;
    let caretPosition: number = event.target.selectionStart;
    let tags: string[] | null = this.comment.match(/\@[a-zA-Z]+/g);
    let indices: number[][] = [];
    let tagging: boolean = false;

    if(tags !== null) {
      indices = this.getIndices(tags)
    }

    if(indices.length > 0) tagging = this.selectCurrentTagOrNull(caretPosition, indices);

    

    if(!tagging) this.userListEnabled = false;
  }

  getIndices(tags: string[])  {
    let lastIdx: number = 0;
    return tags.map(match =>  {
      console.log(this.comment.slice(lastIdx))
      let startIdx: number = this.comment.slice(lastIdx).indexOf(match) + lastIdx;
      let endIdx: number = startIdx + match.length;
      lastIdx = endIdx;
      return [startIdx, endIdx];
    })
  }

  selectCurrentTagOrNull(caretPosition: number, indices: number[][]) {
    let tagging = false;
    for(let range of indices) {
      let [startIdx, endIdx] = range;
      
      if(startIdx < caretPosition && caretPosition <= endIdx) {
        this.tag = this.comment.slice(startIdx, endIdx);
        this.tagIdx = startIdx;
        tagging = true;
        this.filteredUsers = this.userTrie.filteredList(this.tag.slice(1))
        if(this.filteredUsers.length > 0) {
          this.userListEnabled = true;
          this.commentBox?.nativeElement.blur()
        }
        break;
      }
    }
    return tagging;
  }

  refocus(event: any) {
    if(this.userListEnabled) {
      this.userListEnabled = false;
      this.commentBox?.nativeElement.focus()
    }
    if(this.comment.length !== event.target.selectionStart) {
      this.checkForTaggingUser(event);
    }

  }

  submitComment() {
    this.comments.push(this.comment);
    this.comment = "";
    this.userListEnabled = false;
    for(const user of this.taggedUsers) {
      console.log(user)
      alert(user.name + ", " + user.id)
    }
    this.taggedUsers = [];
  }

  updateTag(updatedTag: string) {
    this.comment = this.comment.slice(0, this.tagIdx!) + this.comment.slice(this.tagIdx!).replace(this.tag, updatedTag);
  }

  finalizeTag(user: User) {
    this.updateTag(`@${user!.name} `)
  }

  title = 'tagger';
}
