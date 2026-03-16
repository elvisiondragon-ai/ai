import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Home } from 'lucide-react';

interface AddressProps {
  selectedProvince: string;
  setSelectedProvince: (province: string) => void;
  userAddress: string;
  setUserAddress: (address: string) => void;
  city: string;
  setCity: (city: string) => void;
  district: string;
  setDistrict: (district: string) => void;
  postalCode: string;
  setPostalCode: (postalCode: string) => void;
}

const AddressEn: React.FC<AddressProps> = ({
  selectedProvince,
  setSelectedProvince,
  userAddress,
  setUserAddress,
  city,
  setCity,
  district,
  setDistrict,
  postalCode,
  setPostalCode,
}) => {
  return (
    <>
      <div>
        <Label htmlFor="selectedProvince"><Home className="inline-block w-4 h-4 mr-2"/>Region / State</Label>
        <Input 
          id="selectedProvince" 
          value={selectedProvince} 
          onChange={(e) => setSelectedProvince(e.target.value)} 
          placeholder="e.g. Central Area" 
          required 
          autoComplete="address-level1" 
        />
      </div>
      <div>
        <Label htmlFor="city"><Home className="inline-block w-4 h-4 mr-2"/>City / Town</Label>
        <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Singapore" required autoComplete="address-level2" />
      </div>
      <div>
        <Label htmlFor="district"><Home className="inline-block w-4 h-4 mr-2"/>District / Neighborhood</Label>
        <Input id="district" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="e.g. Orchard" required autoComplete="address-level3" />
      </div>
      <div>
        <Label htmlFor="userAddress"><Home className="inline-block w-4 h-4 mr-2"/>Shipping Address</Label>
        <Input id="userAddress" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} placeholder="e.g. 25 Orchard Road, #05-01" required autoComplete="street-address" />
      </div>
      <div>
        <Label htmlFor="postalCode"><Home className="inline-block w-4 h-4 mr-2"/>Postal Code</Label>
        <Input id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="e.g. 238872" required autoComplete="postal-code" />
      </div>
    </>
  );
};

export default AddressEn;
