-- Tabla de perfiles vinculada a Supabase Auth
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  email text not null unique,
  rol text not null check (rol in ('admin', 'usuario')) default 'usuario',
  grupo text not null check (grupo in ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I')) default 'A',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = uid and p.rol = 'admin'
  );
$$;

create policy "profiles_select_own_or_admin"
on public.profiles
for select
using (
  auth.uid() = id
  or public.is_admin(auth.uid())
);

create policy "profiles_update_own_or_admin"
on public.profiles
for update
using (
  auth.uid() = id
  or public.is_admin(auth.uid())
)
with check (
  auth.uid() = id
  or public.is_admin(auth.uid())
);

create policy "profiles_insert_admin_only"
on public.profiles
for insert
to authenticated
with check (public.is_admin(auth.uid()));

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nombre, email, rol, grupo)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)),
    new.email,
    case
      when coalesce(new.raw_user_meta_data->>'rol', '') in ('admin', 'usuario') then new.raw_user_meta_data->>'rol'
      else 'usuario'
    end,
    case
      when coalesce(new.raw_user_meta_data->>'grupo', '') in ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I') then new.raw_user_meta_data->>'grupo'
      else 'A'
    end
  )
  on conflict (id) do update
    set nombre = excluded.nombre,
        email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute procedure public.handle_new_user_profile();
