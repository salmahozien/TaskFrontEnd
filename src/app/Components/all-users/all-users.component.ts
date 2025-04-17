import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {

constructor(private _userService:UserService,private _router:Router) {}  

users:any[]=[];
  ngOnInit(): void {
    this._userService.GetAllUsers().subscribe((data:any)=>{
    this.users=data
    });
  }


  AddUser() : void
  {
     this._router.navigate(['/AddUserDetails'])
  }

  DownloadFiles(userId: number) {
    this._userService.GetPdf(userId).subscribe(fileBlob => {
      saveAs(fileBlob, `user_${userId}_files.pdf`);
    });
  }
  
  GetUserById(userId: number) {
    this._router.navigate(['/UserDetails'],{ queryParams: { id: userId } });
  }
}
