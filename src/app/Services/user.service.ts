import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http"
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _httpClient:HttpClient) { }

  baseUrl:any="https://localhost:7053/api/";


  //Add Method 
  AddUserDetails(body:any)
  {
    return this._httpClient.post(this.baseUrl + "Users/AddUsers",body);
  }

//GetAllUsers
GetAllUsers()
{
  return this._httpClient.get(this.baseUrl + "Users/GetAllUsers");
}

  //Download Pdf
  GetPdf(id:number) : Observable<Blob>
  {
    // using blob because the response is binary data (file), not JSON or plain text
    // and by default angular expect the espo0nse is json
    return this._httpClient.get(this.baseUrl + "Users/GenerateUserPdf?userId="+id , { responseType: 'blob' }) 
  }

}
