import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from '@/components/ui/select';
import { Home } from 'lucide-react';

interface AdressProps {
  selectedProvince: string;
  setSelectedProvince: (province: string) => void;
  userAddress: string;
  setUserAddress: (address: string) => void;
  kota: string;
  setKota: (kota: string) => void;
  kecamatan: string;
  setKecamatan: (kecamatan: string) => void;
  kodePos: string;
  setKodePos: (kodePos: string) => void;
}

const provinces = [
  "Aceh", "Sumatra Utara", "Sumatra Barat", "Riau", "Kepulauan Riau", "Jambi", "Sumatra Selatan", "Bengkulu", "Lampung", "Kepulauan Bangka Belitung",
  "Banten", "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur",
  "Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara",
  "Gorontalo", "Sulawesi Utara", "Sulawesi Tengah", "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tenggara",
  "Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur",
  "Maluku Utara", "Maluku", "Papua Barat", "Papua Barat Daya", "Papua", "Papua Tengah", "Papua Pegunungan", "Papua Selatan"
];

const Adress: React.FC<AdressProps> = ({
  selectedProvince,
  setSelectedProvince,
  userAddress,
  setUserAddress,
  kota,
  setKota,
  kecamatan,
  setKecamatan,
  kodePos,
  setKodePos,
}) => {
  return (
    <>
      <div>
        <Label htmlFor="selectedProvince"><Home className="inline-block w-4 h-4 mr-2"/>Provinsi</Label>
        <Select onValueChange={setSelectedProvince} value={selectedProvince}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih Provinsi" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Provinsi di Indonesia</SelectLabel>
              {provinces.map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="kota"><Home className="inline-block w-4 h-4 mr-2"/>Kota</Label>
        <Input id="kota" value={kota} onChange={(e) => setKota(e.target.value)} placeholder="Contoh: Jakarta Timur" required autoComplete="address-level2" />
      </div>
      <div>
        <Label htmlFor="kecamatan"><Home className="inline-block w-4 h-4 mr-2"/>Kecamatan</Label>
        <Input id="kecamatan" value={kecamatan} onChange={(e) => setKecamatan(e.target.value)} placeholder="Contoh: Duren Sawit" required autoComplete="address-level3" />
      </div>
      <div>
        <Label htmlFor="userAddress"><Home className="inline-block w-4 h-4 mr-2"/>Alamat Pengiriman</Label>
        <Input id="userAddress" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} placeholder="Jl. Pahlawan No. 123" required autoComplete="street-address" />
      </div>
      <div>
        <Label htmlFor="kodePos"><Home className="inline-block w-4 h-4 mr-2"/>Kode Pos</Label>
        <Input id="kodePos" value={kodePos} onChange={(e) => setKodePos(e.target.value)} placeholder="Contoh: 13440" required autoComplete="postal-code" />
      </div>
    </>
  );
};

export default Adress;
