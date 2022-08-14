import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserList } from '../models/userList';
import { VehicleLocationList } from '../models/vehicleLocationList';

@Injectable()
export class BackendService {
  private baseUrl: string = 'http://mobi.connectedcar360.net/api/';

  constructor(private http: HttpClient) {}

  getUserList(): Observable<UserList> {
    return this.http.get<UserList>(this.baseUrl + '?op=list');
  }

  getVehicleLocation(userId: number): Observable<VehicleLocationList> {
    return this.http.get<VehicleLocationList>(
      this.baseUrl + '?op=getlocations&userid=' + userId
    );
  }
}
