create or replace function get_email_by_username(p_username text)
returns text
language plpgsql
security definer
as $
begin
  return (
    select email from auth.users where raw_user_meta_data->>'username' = p_username
  );
end;
$;
