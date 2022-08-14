import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UserInformation } from 'src/app/models/userInformation';
import { BackendService } from 'src/app/services/backend.service';
import * as L from 'leaflet';
import { VehicleLocation } from 'src/app/models/vehicleLocation';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
  public userList!: UserInformation[];

  public isLoading: boolean = true;
  public failedToLoad: boolean = false;
  public isMapInitialized: boolean = false;

  private map: L.Map | undefined;
  private subscription: Subscription | undefined;

  constructor(
    private service: BackendService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    if (this.subscription != undefined) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  ngOnInit(): void {
    this.subscription = new Subscription();
    this.subscription.add(
      this.service.getUserList().subscribe(
        (userList) => {
          if (userList != undefined && userList.data != undefined) {
            this.userList = userList.data;
            this.isLoading = false;

            localStorage.setItem(
              'data_retreived_data',
              JSON.stringify(new Date())
            );
          }
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
          this.failedToLoad = true;
        }
      )
    );
  }

  selectedUserClicked(selectedUser: number): void {
    this.service.getVehicleLocation(selectedUser).subscribe(
      (res) => {
        if (res.data) {
          console.log(JSON.stringify(res.data));

          if (this.isMapInitialized == false) {
            this.initMap();
            this.isMapInitialized = true;
          }
          this.addMarkers(res.data);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addMarkers(vehicleList: VehicleLocation[]): void {
    if (this.map) {
      const markerIcon = L.icon({
        iconSize: [25, 41],
        iconAnchor: [10, 41],
        popupAnchor: [2, -40],
        iconUrl: 'https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png',
        shadowUrl:
          'https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png',
      });

      let currentMap = this.map;
      vehicleList.forEach((vehicle) => {
        if (vehicle.lat && vehicle.lon) {
          L.marker([vehicle.lat, vehicle.lon], {
            draggable: false,
            title: this.getVehicleTitle(vehicle.vehicleid), // Add a title
            icon: markerIcon,
          }).addTo(currentMap);
        }
      });

      this.changeDetectorRef.detectChanges();
    }
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [56.99243, 24.125647],
      zoom: 14,
      zoomControl: true,
      layers: [
        L.tileLayer(
          'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
          {
            detectRetina: true,
            maxZoom: 20,
            maxNativeZoom: 17,
          }
        ),
      ],
    });
  }

  private getVehicleTitle(vehicleId: number | undefined): string {
    let vehicleTitle = '';

    if (vehicleId) {
      this.userList.forEach((user) => {
        if (user.vehicles) {
          user.vehicles.forEach((v) => {
            if (v.vehicleid == vehicleId) {
              vehicleTitle = v.make + ' ' + v.model + ' ' + v.year; //TODO: addd call for geocoding
            }
          });
        }
      });
    }
    return vehicleTitle;
  }
}
