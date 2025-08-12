# Portfolio Deployment Guide

This guide covers deploying the portfolio with Supabase persistence and Vercel hosting.

## Prerequisites

- Supabase project with PostgreSQL database
- Vercel account
- Node.js 18+ installed locally

## Environment Variables

Set these in your Vercel project:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE=your-service-role-key
```

## Database Setup

1. **Run the SQL setup script** in Supabase SQL Editor:
   ```sql
   -- Copy and paste the contents of database-setup.sql
   ```

2. **Initialize with default data** (optional):
   ```bash
   npm install dotenv
   node setup-database.js
   ```

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

## Deployment to Vercel

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login and link project**:
   ```bash
   vercel login
   vercel link
   ```

3. **Pull environment variables**:
   ```bash
   vercel env pull .env.local
   ```

4. **Test build locally**:
   ```bash
   npm run build
   ```

5. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Connect your repository in Vercel dashboard
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

## Post-Deployment Verification

1. **Check portfolio data loading**:
   - Visit your live site
   - Verify portfolio data loads from Supabase
   - Check browser console for errors

2. **Test CV upload** (Admin only):
   - Upload a CV file
   - Verify it appears in Supabase Storage
   - Check CV download button works

3. **Test contact form**:
   - Submit a contact form
   - Verify email is sent
   - Check for any errors

4. **Verify persistence**:
   - Make changes via Admin panel
   - Reload the page
   - Verify changes persist

## Troubleshooting

### Common Issues

1. **"Missing SUPABASE_URL" error**:
   - Check environment variables in Vercel
   - Verify variable names match exactly

2. **Database connection errors**:
   - Run database-setup.sql in Supabase
   - Check RLS policies
   - Verify service role key

3. **File upload failures**:
   - Check Supabase Storage bucket exists
   - Verify storage policies
   - Check file size limits

4. **Build errors**:
   - Run `npm run build` locally first
   - Check for TypeScript errors
   - Verify all imports are correct

### Debug Commands

```bash
# Check Vercel logs
vercel logs <project-name> --since=1h

# Test database connection locally
node -e "
const { createClient } = require('@supabase/supabase-js');
const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);
client.from('portfolio').select('*').then(console.log).catch(console.error);
"

# Check environment variables
vercel env ls
```

## Security Notes

- **Never expose** `SUPABASE_SERVICE_ROLE` to the client
- **Rotate keys** after deployment if needed
- **Review RLS policies** for production use
- **Monitor admin logs** for suspicious activity

## Performance Optimization

1. **Enable caching** for static assets
2. **Use CDN** for Supabase Storage files
3. **Optimize images** before upload
4. **Monitor database query performance**

## Support

For issues:
1. Check Vercel deployment logs
2. Check Supabase dashboard logs
3. Review browser console errors
4. Test locally with same environment
