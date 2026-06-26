const supabaseUrl = "https://qsuuipcksdmfmxfrshio.supabase.co";
const supabaseKey = "sb_publishable_7J2kagTyldIVHdDvFHDu4Q_fDiflNKB";

window.supabaseClient = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

console.log("Supabase Connected");