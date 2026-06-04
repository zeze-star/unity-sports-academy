-- SQL Script to Update RLS for Local Development
-- This script changes the INSERT policies to allow anonymous inserts for dev testing.

-- Drop the restrictive policies
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON players;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON matches;

-- Create permissive policies for local testing
CREATE POLICY "Enable insert for all users" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON matches FOR INSERT WITH CHECK (true);

-- Create a competitions table if it doesn't exist
CREATE TABLE IF NOT EXISTS competitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    squad TEXT,
    position INTEGER DEFAULT 1,
    next_match TEXT,
    next_match_date TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and create policies for competitions
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON competitions FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON competitions FOR INSERT WITH CHECK (true);
