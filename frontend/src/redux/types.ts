export interface ShippingAddress {
  id: number;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  postal_code: string;
  province: string | null;
  country: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: "admin" | "customer";
  shipping_address_id: number | null;
  created_at: string;
  updated_at: string;
  shipping_address: ShippingAddress | null;
}
