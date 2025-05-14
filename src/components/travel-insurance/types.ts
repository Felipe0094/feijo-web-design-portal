
export type TravelInsuranceFormData = {
  fullName: string;
  cpf: string;
  phone: string;
  email: string;
  tripType: 'national' | 'international';
  destination: string;
  purpose: 'business' | 'leisure';
  departureDate: string;
  returnDate: string;
  motorcycleUse: boolean;
  passengers0to64: number;
  passengers65to70: number;
  passengers71to85: number;
  seller: string;
};
