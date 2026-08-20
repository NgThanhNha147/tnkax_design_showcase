# tnkax design showcase

Static portfolio hosted on GitHub Pages with Supabase Database, Auth, and Storage.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in SQL Editor.
3. Optionally run `supabase/seed.sql` for demo content.
4. In Authentication > Users, create the single admin email/password account.
5. Copy Project URL and anon public key into `supabase-config.js`.

Never put the `service_role` key in frontend code.

## URLs

- Showcase: `/`
- Admin: `/admin.html`

New products uploaded in the admin are stored in the public `product-images` bucket and appear on the showcase immediately.
