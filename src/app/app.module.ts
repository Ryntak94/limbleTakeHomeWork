import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { UserListComponent } from './components/userList/userList.component';
import { CommentListComponent } from './components/commentList/commentList.component';


@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    CommentListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
