import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indna294anh2Zm9wb2JzbmZoYWR4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODgyMzkwOCwiZXhwIjoyMDY0Mzk5OTA4fQ.6FLycPolrinsPc5MoqkVphQoNW3zRp8xlFPoDYLmxuI"

export const supabase = createClient(supabaseUrl, supabaseKey)
