import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserInformation } from 'src/app/models/userInformation';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  @Input()
  public userModel!: UserInformation;

  @Output()
  selectedUser: EventEmitter<number> = new EventEmitter<number>();

  public isSelected: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  onSelected(): void {
    this.isSelected = !this.isSelected;
    this.selectedUser.emit(this.userModel.userid);
  }
}
