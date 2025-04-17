import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './Components/user/user.component';
import { AllUsersComponent } from './Components/all-users/all-users.component';

const routes: Routes = [
  {path: '', redirectTo: 'AllUsers', pathMatch: 'full' }, // ✅ Set default route here
  {path:"AddUserDetails",component:UserComponent},
  {path:"AllUsers",component:AllUsersComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
