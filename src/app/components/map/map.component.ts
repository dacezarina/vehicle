import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  private map: L.Map | undefined;

  private initMap(): void {
    const markerIcon = L.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      // specify the path here
      iconUrl: 'https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png',
      shadowUrl:
        'https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png',
    });
 
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

    L.marker(
      [56.99243, 24.125647],
      {
        draggable: false, // Make the icon dragable
        title: 'Hover Text', // Add a title
        icon: markerIcon,
      } 
    ).addTo(this.map);
  }

  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  setMarker(): void {
    
  }
}
