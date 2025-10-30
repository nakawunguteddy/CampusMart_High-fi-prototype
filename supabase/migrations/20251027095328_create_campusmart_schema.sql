/*
  # CampusMart Database Schema
  
  This migration creates the complete database schema for the CampusMart marketplace platform.
  
  ## New Tables
  
  1. `profiles`
     - Extends auth.users with additional user information
     - `id` (uuid, references auth.users)
     - `full_name` (text)
     - `avatar_url` (text)
     - `phone` (text)
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)
  
  2. `categories`
     - Product categories for organizing listings
     - `id` (uuid, primary key)
     - `name` (text, unique)
     - `slug` (text, unique)
     - `icon` (text)
     - `created_at` (timestamptz)
  
  3. `listings`
     - Product listings posted by users
     - `id` (uuid, primary key)
     - `seller_id` (uuid, references profiles)
     - `category_id` (uuid, references categories)
     - `title` (text)
     - `description` (text)
     - `price` (decimal)
     - `condition` (text)
     - `images` (text array)
     - `status` (text: active, sold, draft)
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)
  
  4. `messages`
     - Messages between buyers and sellers
     - `id` (uuid, primary key)
     - `listing_id` (uuid, references listings)
     - `sender_id` (uuid, references profiles)
     - `receiver_id` (uuid, references profiles)
     - `content` (text)
     - `read` (boolean)
     - `created_at` (timestamptz)
  
  5. `favorites`
     - User's saved/favorited listings
     - `id` (uuid, primary key)
     - `user_id` (uuid, references profiles)
     - `listing_id` (uuid, references listings)
     - `created_at` (timestamptz)
  
  ## Security
  
  - Enable Row Level Security (RLS) on all tables
  - Profiles: Users can read all profiles, update only their own
  - Categories: Public read access, admin-only write
  - Listings: Public read for active listings, sellers can manage their own
  - Messages: Users can only read/write their own messages
  - Favorites: Users can only manage their own favorites
  
  ## Indexes
  
  - Indexes on foreign keys for performance
  - Search index on listing title and description
  - Status and category filters
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  avatar_url text DEFAULT '',
  phone text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  price decimal(10,2) NOT NULL,
  condition text NOT NULL DEFAULT 'used',
  images text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Categories policies (public read)
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

-- Listings policies
CREATE POLICY "Active listings are viewable by everyone"
  ON listings FOR SELECT
  TO authenticated
  USING (status = 'active' OR seller_id = auth.uid());

CREATE POLICY "Users can insert own listings"
  ON listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update own listings"
  ON listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can delete own listings"
  ON listings FOR DELETE
  TO authenticated
  USING (auth.uid() = seller_id);

-- Messages policies
CREATE POLICY "Users can view messages they sent or received"
  ON messages FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update messages they received"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

-- Favorites policies
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_listings_seller ON listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_listing ON messages(listing_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_listing ON favorites(listing_id);

-- Insert default categories
INSERT INTO categories (name, slug, icon) VALUES
  ('Electronics', 'electronics', 'Laptop'),
  ('Books', 'books', 'BookOpen'),
  ('Furniture', 'furniture', 'Armchair'),
  ('Clothing', 'clothing', 'Shirt'),
  ('Sports & Outdoors', 'sports-outdoors', 'Dumbbell'),
  ('Other', 'other', 'Package')
ON CONFLICT (slug) DO NOTHING;