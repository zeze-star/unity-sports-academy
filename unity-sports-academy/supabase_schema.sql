-- SQL Schema for Unity Sports Academy

-- 1. Players Table
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    squad TEXT NOT NULL,
    position TEXT NOT NULL,
    status TEXT NOT NULL,
    performance INTEGER CHECK (performance >= 0 AND performance <= 100),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Matches Table
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_a TEXT NOT NULL,
    team_b TEXT NOT NULL,
    score_a INTEGER DEFAULT 0,
    score_b INTEGER DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('LIVE', 'UPCOMING', 'RESULT')),
    match_time TIMESTAMP WITH TIME ZONE,
    venue TEXT,
    competition TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. News Table
CREATE TABLE IF NOT EXISTS news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Programs Table
CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    age_range TEXT NOT NULL,
    duration TEXT NOT NULL,
    schedule TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create Policies (Public Read Access)
CREATE POLICY "Public Read Access" ON players FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON matches FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON news FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON programs FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON testimonials FOR SELECT USING (true);

-- Create Policies (Insert/Update for Admins)
-- Note: Replace these with proper role-based checks once authentication is fully set up.
CREATE POLICY "Enable insert for authenticated users only" ON players FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON players FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON players FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON matches FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON matches FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON matches FOR DELETE TO authenticated USING (true);

-- Insert Mock Data (Optional Seed)
INSERT INTO players (player_id, name, squad, position, status, performance, image_url) VALUES
('USA-001', 'David Maina', 'Elite U18', 'Forward', 'Active', 88, 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?q=80&w=200&auto=format&fit=crop'),
('USA-042', 'Samuel Wanjiru', 'U13 Foundation', 'Midfielder', 'New', 72, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop');

INSERT INTO matches (team_a, team_b, score_a, score_b, status, match_time, venue, competition) VALUES
('USA U19', 'Gor Mahia Youth', 2, 1, 'LIVE', NOW(), 'Tatu City Stadium', 'Premier Youth League'),
('USA Elite', 'Kariobangi Sharks', 0, 0, 'UPCOMING', NOW() + INTERVAL '4 days', 'Main Pitch', 'Regional Cup');
