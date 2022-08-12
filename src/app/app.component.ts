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
    "<b>@Kevin</b>, when's your next netflix special?",
    "Who is&nbsp;<b>@Jeff</b>&nbsp;and why is he so famous?",
    "<b>@Bryan</b>, could you fetch me an erlenmeyer flask, please?",
    "<b>@Gabbey</b>&nbsp;is one of the greatest gymnasts of our time!",
    "<b>@Kerry</b>&nbsp;gives amazing monologues in Scandal",
    "<b>@Kaleia</b>&nbsp;who? You're not my fiancee!",
    "<b>@Ryan</b>: Limble's newest hire!",
    "<b>@Ian</b>&nbsp;- I mean Gandalf!",
    "<b>@Adam</b>&nbsp;is one of the greatest gymnasts of our time!",
    "<b>@James Madison</b>: \"It's crazy that the guy who comes in second becomes vice President.",
    "<b>@Alexander Hamilton</b>, do you have the votes?",
  ];
  tag: string = "";
  tagIdx?: number;
  taggedUsers = new Set<User>();
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
    {id: 11, name: 'Alexander Hamilton', imgSrc: 'https://i.guim.co.uk/img/media/611c74f4533083450171c9b974b41eacdc9ccf30/344_198_2324_1394/master/2324.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=25204c640b588165b4d5e63f711e623d'},
    {id: 12, name: 'Logan', imgSrc: 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2014/01/21/17/Hugh-Jackman.jpg?width=1200'}
  ]
  userTrie: Trie = new Trie(this.users);
  filteredUsers: User[] = this.users;

  @ViewChild("commentBox") commentBox?: ElementRef;

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {

    this.commentService.userSelected.subscribe(user =>  {
      if(user) this.finalizeTag(user);
      this.closeUserList(event);
      this.commentBox?.nativeElement.focus();
      if(!this.taggedUsers.has(user)) this.taggedUsers.add(user)
      this.tagIndices.push(this.tagIdx!)
    })

    this.commentService.emitCancelTag.subscribe(event =>  {
      this.closeUserList(event);
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

    if(indices.length > 0) tagging = this.selectCurrentTagOrNull(caretPosition, indices, event);
    if(!tagging) this.closeUserList(event);
  }

  getIndices(tags: string[])  {
    let lastIdx: number = 0;
    return tags.map(match =>  {
      let startIdx: number = this.comment.slice(lastIdx).indexOf(match) + lastIdx;
      let endIdx: number = startIdx + match.length;
      lastIdx = endIdx;
      return [startIdx, endIdx];
    })
  }

  selectCurrentTagOrNull(caretPosition: number, indices: number[][], event: any) {
    let tagging = false;
    if(event.key === "Enter" || event.key === "Escape") return tagging
    for(let range of indices) {
      let [startIdx, endIdx] = range;
      if(startIdx < caretPosition && caretPosition <= endIdx) {
        this.tag = this.comment.slice(startIdx, endIdx);
        this.tagIdx = startIdx;
        tagging = true;
        this.filteredUsers = this.userTrie.filteredList(this.tag.slice(1))
        if(this.filteredUsers.length > 0) {
          this.userListEnabled = true;
        }
        break;
      }
    }
    return tagging;
  }

  refocusOnClick(event: any) {
    if(this.userListEnabled) {
      this.closeUserList(event);
      this.commentBox?.nativeElement.focus()
    }
      this.checkForTaggingUser(event);

  }

  submitComment() {
    let formattedComment = this.comment
    let taggedUsersArr = Array.from(this.taggedUsers);
    this.comment = "";
    for(let i = taggedUsersArr.length - 1; i >= 0; i--) {
      if(taggedUsersArr[i] !== undefined && taggedUsersArr[i] !== null) {
        formattedComment = formattedComment.slice(0, this.tagIndices[i]) + formattedComment.slice(this.tagIndices[i]).replace(`@${taggedUsersArr[i].name}`, `<b>@${taggedUsersArr[i].name}</b>`);
      }
    }
    formattedComment = formattedComment.replaceAll(' ', '&nbsp;')
    this.comments.push(formattedComment);
    this.closeUserList(event);
    for(const user of taggedUsersArr) {
      if(user !== undefined && user !== null && formattedComment.includes(user.name))  {
        alert(user.name + ", " + user.id)
      }
    }
    this.taggedUsers = new Set();
  }

  updateTag(updatedTag: string) {
    this.comment = this.comment.slice(0, this.tagIdx!) + this.comment.slice(this.tagIdx!).replace(this.tag, updatedTag);
  }

  finalizeTag(user: User) {
    this.updateTag(`@${user!.name}`)
  }

  closeUserList(event: any) {
    this.userListEnabled = false;
  }

  title = 'Tagger';
}
