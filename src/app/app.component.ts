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
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?",
    "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
    "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."
  ];
  tag: string = "";
  tagIdx?: number;
  taggedUsers: User[] = [];
  tagIndices: number[] = []
  users: User[] = [
    {id: 1, name: 'Kevin'},
    {id: 2, name: 'Jeff'},
    {id: 3, name: 'Bryan'},
    {id: 4, name: 'Gabbey'},
    {id: 5, name: 'Kerry'},
    {id: 6, name: 'Kaleia'},
    {id: 7, name: 'Ryan'},
    {id: 8, name: 'Ian'},
    {id: 9, name: 'Adam'},
    {id: 10, name: 'James Madison'},
    {id: 10, name: 'Alexander Hamilton'}
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
      formattedComment = formattedComment.slice(0, this.tagIndices[i]) + formattedComment.slice(this.tagIndices[i]).replace(this.taggedUsers[i].name, `<b>${this.taggedUsers[i].name}</b>`)
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
