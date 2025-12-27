-- HustleClub Database Schema
-- Run this SQL in your Supabase SQL editor to create the required tables and RLS policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Clipping jobs table
CREATE TABLE IF NOT EXISTS public.clipping_jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  platform TEXT NOT NULL, -- e.g., 'YouTube', 'TikTok', 'Instagram'
  payout DECIMAL(10,2) NOT NULL,
  video_url TEXT,
  requirements TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Thrift items table
CREATE TABLE IF NOT EXISTS public.thrift_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  condition TEXT, -- e.g., 'New', 'Like New', 'Good', 'Fair'
  image_urls TEXT[], -- Array of image URLs
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enrollments table (users enrolling in courses)
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, course_id)
);

-- Job applications table (users applying to clipping jobs)
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES public.clipping_jobs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(job_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clipping_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thrift_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Courses policies
CREATE POLICY "Users can view all published courses" ON public.courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Users can view their own courses" ON public.courses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own courses" ON public.courses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own courses" ON public.courses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own courses" ON public.courses
  FOR DELETE USING (auth.uid() = user_id);

-- Clipping jobs policies
CREATE POLICY "Anyone can view active clipping jobs" ON public.clipping_jobs
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view their own clipping jobs" ON public.clipping_jobs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clipping jobs" ON public.clipping_jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clipping jobs" ON public.clipping_jobs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clipping jobs" ON public.clipping_jobs
  FOR DELETE USING (auth.uid() = user_id);

-- Thrift items policies
CREATE POLICY "Anyone can view available thrift items" ON public.thrift_items
  FOR SELECT USING (is_available = true);

CREATE POLICY "Users can view their own thrift items" ON public.thrift_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own thrift items" ON public.thrift_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own thrift items" ON public.thrift_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own thrift items" ON public.thrift_items
  FOR DELETE USING (auth.uid() = user_id);

-- Enrollments policies
CREATE POLICY "Users can view their own enrollments" ON public.enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own enrollments" ON public.enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Job applications policies
CREATE POLICY "Users can view their own applications" ON public.job_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Job creators can view applications to their jobs" ON public.job_applications
  FOR SELECT USING (
    job_id IN (
      SELECT id FROM public.clipping_jobs WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own applications" ON public.job_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Job creators can update application status" ON public.job_applications
  FOR UPDATE USING (
    job_id IN (
      SELECT id FROM public.clipping_jobs WHERE user_id = auth.uid()
    )
  );

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_courses
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_clipping_jobs
  BEFORE UPDATE ON public.clipping_jobs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_thrift_items
  BEFORE UPDATE ON public.thrift_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_job_applications
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();