import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { User } from 'src/app/types/User';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent {
    @Input() user?: User;
    @Output() selectedUser = new EventEmitter<User>();

    constructor(private commentService: CommentService) {}

}