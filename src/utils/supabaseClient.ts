import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  role: number;
  email: string;
  password: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  updated_at: string;
}
