import { Component, Input } from '@angular/core';
import { CommentComponent } from '../comment/comment.component'

@Component({
  selector: 'app-commentList',
  templateUrl: './commentList.component.html',
  styleUrls: ['./commentList.component.css']
})

export class CommentListComponent {
    @Input() comments: string[] = [];
}
