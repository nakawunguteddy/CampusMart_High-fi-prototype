/*
  # Enhanced CampusMart Schema
  
  This migration enhances the existing schema with additional fields for improved functionality.
  
  ## Changes to Tables
  
  1. `profiles` - Add new fields:
     - `campus_location` (text) - User's campus/university
     - `verified_student` (boolean) - Verification status
     - `rating` (decimal) - Average seller rating
     - `total_ratings` (integer) - Number of ratings received
     - `items_sold` (integer) - Total items sold
     - `items_purchased` (integer) - Total items purchased
     - `member_since` (timestamptz) - Account creation date
  
  2. `listings` - Add new fields:
     - `location` (text) - Pickup location/university
     - `negotiable` (boolean) - Price negotiable flag
     - `contact_methods` (text array) - Preferred contact methods
     - `views` (integer) - Number of views
  
  3. `messages` - Add new fields:
     - `read_at` (timestamptz) - When message was read
  
  4. `offers` - New table for price negotiations:
     - `id` (uuid, primary key)
     - `listing_id` (uuid, references listings)
     - `buyer_id` (uuid, references profiles)
     - `seller_id` (uuid, references profiles)
     - `offer_amount` (decimal)
     - `message` (text)
     - `status` (text: pending, accepted, rejected)
     - `created_at` (timestamptz)
  
  5. `reviews` - New table for seller ratings:
     - `id` (uuid, primary key)
     - `seller_id` (uuid, references profiles)
     - `buyer_id` (uuid, references profiles)
     - `listing_id` (uuid, references listings)
     - `rating` (integer)
     - `comment` (text)
     - `created_at` (timestamptz)
  
  ## Security
  
  - Enable RLS on new tables
  - Add appropriate policies for offers and reviews
*/

-- Add new columns to profiles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'campus_location') THEN
    ALTER TABLE profiles ADD COLUMN campus_location text DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'verified_student') THEN
    ALTER TABLE profiles ADD COLUMN verified_student boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'rating') THEN
    ALTER TABLE profiles ADD COLUMN rating decimal(3,2) DEFAULT 0.0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'total_ratings') THEN
    ALTER TABLE profiles ADD COLUMN total_ratings integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'items_sold') THEN
    ALTER TABLE profiles ADD COLUMN items_sold integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'items_purchased') THEN
    ALTER TABLE profiles ADD COLUMN items_purchased integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'member_since') THEN
    ALTER TABLE profiles ADD COLUMN member_since timestamptz DEFAULT now();
  END IF;
END $$;

-- Add new columns to listings
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'location') THEN
    ALTER TABLE listings ADD COLUMN location text DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'negotiable') THEN
    ALTER TABLE listings ADD COLUMN negotiable boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'contact_methods') THEN
    ALTER TABLE listings ADD COLUMN contact_methods text[] DEFAULT ARRAY['chat'];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'views') THEN
    ALTER TABLE listings ADD COLUMN views integer DEFAULT 0;
  END IF;
END $$;

-- Add new column to messages
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'read_at') THEN
    ALTER TABLE messages ADD COLUMN read_at timestamptz;
  END IF;
END $$;

-- Create offers table
CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  buyer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  offer_amount decimal(10,2) NOT NULL,
  message text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  buyer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(buyer_id, seller_id, listing_id)
);

-- Enable RLS on new tables
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Offers policies
CREATE POLICY "Users can view offers they sent or received"
  ON offers FOR SELECT
  TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create offers"
  ON offers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Sellers can update offer status"
  ON offers FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_offers_buyer ON offers(buyer_id);
CREATE INDEX IF NOT EXISTS idx_offers_seller ON offers(seller_id);
CREATE INDEX IF NOT EXISTS idx_offers_listing ON offers(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_seller ON reviews(seller_id);
CREATE INDEX IF NOT EXISTS idx_reviews_buyer ON reviews(buyer_id);

-- Function to update seller rating
CREATE OR REPLACE FUNCTION update_seller_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET 
    rating = (SELECT AVG(rating)::decimal(3,2) FROM reviews WHERE seller_id = NEW.seller_id),
    total_ratings = (SELECT COUNT(*) FROM reviews WHERE seller_id = NEW.seller_id)
  WHERE id = NEW.seller_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update seller rating after review
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_seller_rating_trigger') THEN
    CREATE TRIGGER update_seller_rating_trigger
    AFTER INSERT ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_seller_rating();
  END IF;
END $$;