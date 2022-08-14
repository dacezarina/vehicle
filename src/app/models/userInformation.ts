import { Vehicle } from './vehicle';
import { VehicleOwner } from './vehicleOwner';

export class UserInformation {
  userid!: number;
  owner!: VehicleOwner;
  vehicles!: Vehicle[];
}
