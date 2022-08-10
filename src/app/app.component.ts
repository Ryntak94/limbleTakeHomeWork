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
  comments: string[] = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    "Sed ut perspiciatis unde omnis",
    "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give",
    "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi",
    "<b>@Alexander Hamilton</b>, do you have the votes?"
  ];
  tag: string = "";
  tagIdx?: number;
  taggedUsers: User[] = [];
  tagIndices: number[] = []
  users: User[] = [
    {id: 1, name: 'Kevin', imgSrc: 'https://www.biography.com/.image/t_share/MTQzMzA3MjQ0MzI5NTEwNDcx/kevin-hart_gettyimages-450909048jpg.jpg'},
    {id: 2, name: 'Jeff', imgSrc: 'https://pyxis.nymag.com/v1/imgs/187/9d6/3d89a91cdd64dabcd5908c5a6a6bc0a2c6-11-jeff-goldblum.rsquare.w700.jpg'},
    {id: 3, name: 'Bryan', imgSrc: 'https://hips.hearstapps.com/esquireuk.cdnds.net/15/37/2048x2730/2048x2730-walter-white-rumour-bryan-cranston-43-jpg-21006810.jpg'},
    {id: 4, name: 'Gabbey', imgSrc: 'https://imgix.ranker.com/user_node_img/3177/63527153/original/gabrielle-douglas-athletes-photo-u1?auto=format&q=60&fit=crop&fm=pjpg&dpr=2&crop=faces&h=125&w=125'},
    {id: 5, name: 'Kerry', imgSrc: 'https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTQ0NzQxMzI0MjQ1OTY3OTE4/kerry_washington_jason_laveris_filmmagic_getty_images_633021804_profile.jpg'},
    {id: 6, name: 'Kaleia', imgSrc: 'https://m.media-amazon.com/images/M/MV5BOWNhZjc5MDQtZjA1My00M2M5LTk2NzUtN2I3NjUyODA0ZDc5XkEyXkFqcGdeQXVyODEzNDE0MjM@._V1_UX180_CR0,0,180,180_AL_.jpg'},
    {id: 7, name: 'Ryan', imgSrc: 'https://www.themoviedb.org/t/p/w235_and_h235_face/4SYTH5FdB0dAORV98Nwg3llgVnY.jpg'},
    {id: 8, name: 'Ian', imgSrc: 'https://i.guim.co.uk/img/media/d56cf414fd7f4681a7fc2b54c367ef6f4364a4c2/0_288_3567_3564/master/3567.jpg?width=1020&quality=85&fit=max&s=13d41921a7e7ebd4f3edd875ae69e2a4'},
    {id: 9, name: 'Adam', imgSrc: 'https://pittsburghlectures.org/wp-content/uploads/2019/02/adam-savage.jpg'},
    {id: 10, name: 'James Madison', imgSrc: 'https://images.saymedia-content.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:eco%2Cw_1200/MTc0NDUyOTAxOTA0MDAwNjQ2/james-madison-biography-fourth-president-of-the-united-states.jpg'},
    {id: 10, name: 'Alexander Hamilton', imgSrc: 'https://i.guim.co.uk/img/media/611c74f4533083450171c9b974b41eacdc9ccf30/344_198_2324_1394/master/2324.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=25204c640b588165b4d5e63f711e623d'}
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
      this.tagIndices.push(this.tagIdx!)
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
    console.log(1)
    let tagging = false;
    for(let range of indices) {
      let [startIdx, endIdx] = range;
      console.log(2)
      if(startIdx < caretPosition && caretPosition <= endIdx) {
        this.tag = this.comment.slice(startIdx, endIdx);
        this.tagIdx = startIdx;
        tagging = true;
        this.filteredUsers = this.userTrie.filteredList(this.tag.slice(1))
        console.log(3)
        if(this.filteredUsers.length > 0) {
          console.log(4)
          this.userListEnabled = true;
          this.commentBox?.nativeElement.blur()
        }
        break;
      }
    }
    return tagging;
  }

  refocusOnClick(event: any) {
    if(this.userListEnabled) {
      this.userListEnabled = false;
      this.commentBox?.nativeElement.focus()
    }
    if(this.comment.length !== event.target.selectionStart) {
      this.checkForTaggingUser(event);
    }

  }

  submitComment() {
    let formattedComment = this.comment
    this.comment = "";
    for(let i = this.taggedUsers.length - 1; i >= 0; i--) {
      formattedComment = formattedComment.slice(0, this.tagIndices[i]) + formattedComment.slice(this.tagIndices[i]).replace(`@${this.taggedUsers[i].name}`, `<b>@${this.taggedUsers[i].name}</b>`).replace('</b> ', '</b>&nbsp')
    }
    console.log(formattedComment)
    this.comments.push(formattedComment);
    
    this.userListEnabled = false;
    for(const user of this.taggedUsers) {
      
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
