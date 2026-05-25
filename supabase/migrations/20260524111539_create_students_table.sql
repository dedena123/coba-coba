/*
  # Create Students Table for Graduation System

  1. New Tables
    - `students`
      - `id` (uuid, primary key)
      - `name` (text, student's full name)
      - `graduated` (boolean, graduation status)
      - `nisn` (text, optional student ID number)
      - `school_year` (text, academic year)
      - `created_at` (timestamp)
      
  2. Security
    - Enable RLS on `students` table
    - Public read access for checking graduation status
    - No write access from frontend (admin managed)

  3. Initial Data
    - Inserts 29 students from SDN CONGGEANG 1
    - 6 students marked as not graduated (for prank/testing purposes)
    - All students have complete metadata

  4. Notes
    - This table is public-readable to allow students to check their status
    - Data is managed by school administrators
    - Names are stored in proper case for display
*/

CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  graduated boolean NOT NULL DEFAULT true,
  nisn text,
  school_year text DEFAULT '2025/2026',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create public read policy for graduation checking
CREATE POLICY "Anyone can view student graduation status"
  ON students FOR SELECT
  TO public
  USING (true);

-- Insert student data (29 students, 6 not graduated)
INSERT INTO students (name, graduated, nisn) VALUES
  ('Adi Pratama', true, '001'),
  ('Aditya Wijaya', true, '002'),
  ('Ahmad Fauzi', false, '003'),
  ('Anisa Rahmawati', true, '004'),
  ('Bagas Saputra', true, '005'),
  ('Budi Setiawan', true, '006'),
  ('Citra Lestari', false, '007'),
  ('Daffa Alfarizi', true, '008'),
  ('Dewi Sartika', true, '009'),
  ('Dimas Nugraha', true, '010'),
  ('Eka Putri', true, '011'),
  ('Fajar Ramadhan', false, '012'),
  ('Fitri Handayani', true, '013'),
  ('Gilang Permana', true, '014'),
  ('Hendra Wijaya', true, '015'),
  ('Indah Permatasari', false, '016'),
  ('Kevin Sanjaya', true, '017'),
  ('Lesti Kejora', true, '018'),
  ('Muhammad Rizky', true, '019'),
  ('Nabila Syakieb', true, '020'),
  ('Naufal Azmi', true, '021'),
  ('Putri Ayu', false, '022'),
  ('Rafi Ahmad', true, '023'),
  ('Rini Astuti', true, '024'),
  ('Rizky Billar', true, '025'),
  ('Siti Aminah', true, '026'),
  ('Taufik Hidayat', false, '027'),
  ('Wulan Guritno', true, '028'),
  ('Zidan Alamsyah', true, '029');

-- Create index for faster name searches
CREATE INDEX IF NOT EXISTS idx_students_name ON students(name);
CREATE INDEX IF NOT EXISTS idx_students_graduated ON students(graduated);