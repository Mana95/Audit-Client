import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ECommerceService {
  private readonly calanderItemData$ = new Subject<any>();
  private readonly dashBoardItemData$ = new Subject<any>();

  constructor() { }

  setCalanderItemData(data: any) {
    this.calanderItemData$.next(data);
  }

  setDashBoardData(data: any){
    this.dashBoardItemData$.next(data);
  }

  getDashBoardData(){
    return this.dashBoardItemData$.asObservable();
  }

  getCalanderItemData(): Observable<any> {
    return this.calanderItemData$.asObservable();
  }
}
