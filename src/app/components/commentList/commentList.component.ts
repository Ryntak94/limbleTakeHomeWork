import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-commentList',
  templateUrl: './commentList.component.html',
  styleUrls: ['./commentList.component.css']
})

export class CommentListComponent {
    @Input() comments: String[] = [];
}
