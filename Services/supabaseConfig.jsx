import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://eprsqluurvimmxxolnir.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwcnNxbHV1cnZpbW14eG9sbmlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwNDU4MjUsImV4cCI6MjAzOTYyMTgyNX0.3o7pRNls5KoPYEow7NLIgAoLeR7aiBu0rH3HWh8cF6M";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
