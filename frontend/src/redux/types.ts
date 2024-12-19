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

export interface Review {
  id: number;
  user_id: number;
  message: string;
  rating: number;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  brand_id: number;
  category_id: number;
  user_id: number;
  images: File[] | string[];
  price: string;
  quantity: number;
  total_sold: number;
  total_qty: number;
  total_reviews: number;
  average_rating: number;
  brand: string;
  category: string;
  color_id: number[];
  size_id: number[];
  colors: string[];
  sizes: string[];
  reviews: Review[];
}

export interface Category {
  id: number;
  name: string;
  user_id: number;
  image: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Brand {
  id: number;
  name: string;
  user_id: number;
  image: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Color {
  id: number;
  name: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Size {
  id: number;
  name: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Coupon {
  id: number;
  code: string;
  start_date: string;
  end_date: string;
  discount: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  is_expired: boolean;
  days_left: string;
}
