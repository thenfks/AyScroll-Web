#!/bin/bash

# Script to update the username generation function in Supabase

echo "Updating username generation function..."

# Read the SQL file
SQL_CONTENT=$(cat supabase/migrations/20260112_1649_update_username_generation.sql)

# Execute using psql through supabase
echo "$SQL_CONTENT" | supabase db reset --db-url "postgresql://postgres.wbsepuoccppuqirtowzg:$SUPABASE_DB_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"

echo "Done! Username generation updated to format: maya-{first3letters}-{4digits}"
