import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://gufdnhpqywfbkzmzgtil.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1ZmRuaHBxeXdmYmt6bXpndGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkwNjU0NTAsImV4cCI6MjAzNDY0MTQ1MH0.2VpyVK2Vvi_U5DB9roXSJbUeD3fut0Nr3SDrWRCezGk";

export const supabase = createClient(supabaseUrl, supabaseKey);
