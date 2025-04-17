import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users-details',
  templateUrl: './users-details.component.html',
  styleUrls: ['./users-details.component.css']
})
export class UsersDetailsComponent implements OnInit {

  userId!: number;
  userData: any;
  isLoading = true;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    // Get user ID from route
    this.route.queryParams.subscribe(params => {
      this.userId = +params['id']; // assuming ?id=123
      if (this.userId) {
        this.fetchUser();
      }
    });
  }

  fetchUser() {
    this.userService.getUserById(this.userId).subscribe(
      (response: any) => {
        this.userData = response;
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text:"Invalid User",
          icon: 'error',
          confirmButtonText: 'OK'
         })
      }
    );
  }

  DownloadFile(id: number) {
    this.userService.GetPdf(id).subscribe(blob => {
      saveAs(blob, "UserDetails.pdf");
    });
  }
}