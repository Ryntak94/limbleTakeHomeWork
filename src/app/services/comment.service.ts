import { Injectable, EventEmitter } from "@angular/core";
import { User } from "../types/User";

@Injectable()
export class CommentService {
    constructor()   {}

    userSelected = new EventEmitter<User>();

    selectUser(user: User)  {
        this.userSelected.emit(user);
    }
}