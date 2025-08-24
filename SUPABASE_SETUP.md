# Supabase Setup Guide

## Issue: Data from Supabase not appearing in admin panel

The admin panel is not loading data from Supabase because the environment variables are not configured.

## Solution: Configure Environment Variables

### Step 1: Create .env.local file

Create a file named `.env.local` in your project root directory (same level as `package.json`).

### Step 2: Add your Supabase credentials

Copy the following content into your `.env.local` file and replace the placeholder values with your actual Supabase credentials:

```bash
# Supabase Configuration
# Fill in your actual values from your Supabase project

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE=your-service-role-key-here

# Admin Authentication
ADMIN_USER_ID=your-admin-username
ADMIN_PASSWORD_HASH=your-sha256-password-hash
ADMIN_EMAIL=your-admin-email@example.com

# Email Service (Optional)
RESEND_API_KEY=your-resend-api-key

# Optional: For local development
NODE_ENV=development
```

### Step 3: Get your Supabase credentials

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE`

### Step 4: Generate Admin Password Hash

To generate a SHA-256 hash for your admin password:

```bash
# Using Node.js
node -e "console.log(require('crypto').createHash('sha256').update('your-password').digest('hex'))"

# Using PowerShell
[System.Security.Cryptography.SHA256]::Create().ComputeHash([System.Text.Encoding]::UTF8.GetBytes("your-password")) | ForEach-Object { $_.ToString("x2") } | Join-String
```

### Step 5: Restart your development server

After creating the `.env.local` file:

1. Stop your current server (Ctrl+C)
2. Run `npm run dev` again

### Step 6: Verify the setup

1. Go to your admin panel
2. Check the browser console for any errors
3. The data should now load from Supabase

## Important Notes

- **Never commit `.env.local` to git** - it's already in `.gitignore`
- The `SUPABASE_SERVICE_ROLE` key has admin privileges - keep it secure
- Make sure your Supabase project has a `portfolio` table with the correct structure
- Admin credentials are now required and must be set in environment variables

## Table Structure

Your Supabase `portfolio` table should have:
- `id` (integer, primary key)
- `data` (jsonb) - containing all your portfolio data

## Troubleshooting

If you still have issues:

1. Check browser console for errors
2. Verify your Supabase credentials are correct
3. Ensure your Supabase project is active
4. Check if the `portfolio` table exists and has data
5. Verify all required environment variables are set

## Security Reminders

- Keep your `.env.local` file secure and never share it
- Use strong, unique passwords for admin accounts
- Regularly rotate your Supabase API keys
- Monitor your Supabase project for unusual activity
