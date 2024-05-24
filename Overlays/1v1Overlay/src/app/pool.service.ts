import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PoolService {

  private messageSource = new BehaviorSubject<any>({});
  currentPool = this.messageSource.asObservable();

  constructor() { }

  changePool(pool: any) {
    this.messageSource.next(pool);
  }
}
