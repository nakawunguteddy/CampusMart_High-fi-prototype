import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string;
          phone: string;
          created_at: string;
          updated_at: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string;
          created_at: string;
        };
      };
      listings: {
        Row: {
          id: string;
          seller_id: string;
          category_id: string | null;
          title: string;
          description: string;
          price: number;
          condition: string;
          images: string[];
          status: string;
          created_at: string;
          updated_at: string;
        };
      };
      messages: {
        Row: {
          id: string;
          listing_id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          read: boolean;
          created_at: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          listing_id: string;
          created_at: string;
        };
      };
    };
  };
};
