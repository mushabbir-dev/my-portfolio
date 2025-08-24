# Certifications Migration Guide

## Overview

This guide explains how to use the new **Certifications Migration Tool** to consolidate duplicate data structures in your portfolio database.

## Problem

Your portfolio currently has two separate data structures for certifications:
- `certifications` - Contains relative paths and some absolute URLs
- `certificates` - Contains public Supabase URLs

This creates confusion and maintenance issues. The migration tool consolidates both into a single, clean `certifications` schema.

## Solution

The migration tool will:
1. **Merge** both data sources into a single `certifications` array
2. **Normalize** the data structure for consistency
3. **Remove** the duplicate `certificates` field
4. **Preserve** all your existing certification data

## How to Use

### Step 1: Access the Migration Tool

1. Go to your admin panel: `/admin`
2. Click on the **"Migration Tool"** tab (🔄 icon)
3. You'll see the current data status and migration options

### Step 2: Preview the Migration (Recommended)

1. Click **"Preview Migration"** to see what will happen
2. Review the before/after data counts
3. Check the detailed migration preview
4. Ensure you're comfortable with the changes

### Step 3: Execute the Migration

1. Click **"Execute Migration"** to perform the actual migration
2. Wait for the process to complete
3. Verify the success message
4. Your data is now consolidated!

## What Happens During Migration

### Data Normalization

The tool uses the `normalizeCertifications` function to:

```typescript
// Combines both data sources
const a = data.certifications || [];  // relative paths
const b = data.certificates || [];    // public URLs

// Merges and normalizes
const merged = [...mappedB, ...mappedA].filter(x => x.pdf);
```

### Field Mapping

| Source | Field | Target | Notes |
|--------|-------|--------|-------|
| `certifications` | `name` | `name` | Preserved as-is |
| `certifications` | `issuer` | `issuer` | Preserved as-is |
| `certifications` | `date` | `date` | Preserved as-is |
| `certifications` | `pdf` or `url` | `pdf` | Must start with `http` |
| `certifications` | `image` | `image` | Preserved as-is |
| `certificates` | `name` | `name` | Preserved as-is |
| `certificates` | `issuer` | `issuer` | Preserved as-is |
| `certificates` | `date` | `date` | Converted to multilingual format |
| `certificates` | `url` | `pdf` | Must start with `http` |

### Data Filtering

Only certifications with valid PDF URLs (starting with `http`) are included in the final result.

## After Migration

### What You'll Have

- ✅ **Single `certifications` array** with all your data
- ✅ **Normalized structure** for consistency
- ✅ **No duplicate fields** to maintain
- ✅ **All working PDF links** preserved

### What Gets Removed

- ❌ **Duplicate `certificates` field** (no more confusion)
- ❌ **Invalid PDF URLs** (non-http links)
- ❌ **Malformed data** (automatically cleaned)

## Safety Features

### Preview Mode
- **No data changes** until you explicitly execute
- **Full visibility** into what will happen
- **Validation** of the migration process

### Error Handling
- **Comprehensive logging** of all operations
- **Rollback capability** if something goes wrong
- **Detailed error messages** for troubleshooting

### Data Integrity
- **All existing data** is preserved
- **No data loss** during migration
- **Automatic validation** of results

## Important Notes

⚠️ **This is a ONE-TIME operation!** Run it only once.

⚠️ **Backup your data** before running (though the tool is safe)

⚠️ **Test in preview mode** first to understand the changes

## Troubleshooting

### Common Issues

1. **Migration fails**: Check the error message and ensure your database is accessible
2. **Data not showing**: Refresh the admin panel after successful migration
3. **PDFs not loading**: Verify that your PDF URLs are valid and accessible

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Review the migration details in the admin panel
3. Check your database connection and permissions

## Technical Details

### API Endpoints

- **GET** `/api/migrate-certifications` - Preview migration
- **POST** `/api/migrate-certifications` - Execute migration

### Database Changes

- **Updates** the `portfolio` table's `data` column
- **Modifies** the JSON structure within the data
- **Preserves** all other portfolio sections

### Rollback

If you need to rollback:
1. Restore from your database backup
2. Or manually restore the previous data structure

---

**Need help?** Check the admin logs or contact support.
