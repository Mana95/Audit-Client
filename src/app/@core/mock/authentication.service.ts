import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { loginUser } from '../data/users';



@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
   }



  
  public get currentUserValue() {
    return this.currentUserSubject.value;
  }
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  login(email:string , password:string): Observable<any> {
    return this.http.post<any>(`http://localhost:3000/routes/login` ,{email:email,password:password} )  
    .pipe(map(user => {
      // login successfull if there is a jwt token in the response
      if (user && user.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }

      return user;
    })); 
  }

  register(data):Observable<any>{
    return this.http.post(`http://localhost:3000/routes/register/` ,data); 
  }

  requestReset(data): Observable<any> {
    return this.http.post(`http://localhost:3000/routes/req-reset-password` ,data);
  }
  ValidPasswordToken(body): Observable<any> {
    return this.http.post(`http://localhost:3000/routes/valid-password-token` ,body);
  }

  newPassword(body): Observable<any> {
    return this.http.post(`http://localhost:3000/routes/new-password`, body);
  }
}
