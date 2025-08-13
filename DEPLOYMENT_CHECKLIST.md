# Supabase Migration Deployment Checklist

## Pre-flight Verification
- [ ] Verify `assets` bucket exists in Supabase Storage (Public)
- [ ] Verify folders `cv/`, `images/`, `papers/` exist in assets bucket
- [ ] Verify `public.portfolio` table exists with row `id=1` and `data` JSONB column
- [ ] Verify RLS policy allows SELECT for anon users

## Environment Variables
- [ ] `SUPABASE_URL` set in Preview environment
- [ ] `SUPABASE_SERVICE_ROLE` set in Preview environment  
- [ ] `SUPABASE_ANON_KEY` set in Preview environment
- [ ] `SUPABASE_URL` set in Production environment
- [ ] `SUPABASE_SERVICE_ROLE` set in Production environment
- [ ] `SUPABASE_ANON_KEY` set in Production environment

## Build & Deploy
- [ ] Run `npm run build` locally to verify no build errors
- [ ] Deploy to Preview: `vercel deploy`
- [ ] Test all functionality in Preview environment
- [ ] Deploy to Production: `vercel deploy --prod`

## Post-Deployment Testing
- [ ] Test CV upload (English & Japanese)
- [ ] Test CV download
- [ ] Test CV deletion
- [ ] Test profile picture upload
- [ ] Test profile picture deletion
- [ ] Test image upload
- [ ] Test image deletion
- [ ] Test paper upload
- [ ] Test paper deletion
- [ ] Test certificate upload
- [ ] Test certificate deletion
- [ ] Verify Admin panel shows real errors (not silent success)
- [ ] Verify main site reflects changes immediately

## Diagnostic Route
- [ ] Test `/api/_diag` returns 200 status
- [ ] Verify database connection test passes
- [ ] Verify storage write test passes

## Monitoring
- [ ] Check Vercel logs: `vercel logs <project> --since=1h`
- [ ] Monitor for any 4xx/5xx errors in Admin operations
- [ ] Verify storage objects are properly created/deleted

## Rollback Plan
- [ ] Keep previous deployment as backup
- [ ] Document any manual database changes needed
- [ ] Have previous file storage backup ready

