# Realtime-Chat-App-React

### Installation guide
1. Clone this repo.
2. Create a new Supabase project and add `anon key` to the `.env` file as mentioned.
3. To create the necessary tables other than `auth.users` (which is already created at the time of supabase init), run the following SQL query in the Supabase SQL Editor:
```
create type public.channel_type as enum ('one-on-one', 'group');

create table public.channels (
  id            bigint generated by default as identity primary key,
  inserted_at   timestamp with time zone default timezone('utc'::text, now()) not null,
  slug          text not null,
  created_by    uuid references auth.users not null,
  type  public.channel_type not null default 'one-on-one'
);
comment on table public.channels is 'Topics and groups.';

create table public.messages (
  id            bigint generated by default as identity primary key,
  inserted_at   timestamp with time zone default timezone('utc'::text, now()) not null,
  message       text,
  imgurl        text,
  user_id       uuid references auth.users not null,
  channel_id    bigint references public.channels on delete cascade not null,
  constraint check_message_or_imgurl_not_null check (not(message is null and imgurl is null))
);
comment on table public.messages is 'Individual messages sent by each user.';

create table public.participants (
  channel_id    bigint references public.channels on delete cascade not null,
  user_id       uuid references auth.users not null,
  primary key (channel_id, user_id)
);
comment on table public.participants is 'Participants in channels.';

create table public.contacts (
  id            bigint generated by default as identity primary key,
  inserted_at   timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id       uuid references auth.users not null,
  contact_id    text,
  contact_email text not null,
  contact_name  text not null,
  constraint unique_contact unique (user_id, contact_email)
);
comment on table public.contacts is 'User contacts.';
comment on column public.contacts.contact_id is 'ID of the contact user if the user exists.';
```
should be obvious that the result is __NOT IDEMPOTENT__ 

4. In the project's root directory run `npm install`
5. To start the project run `npm run dev`

### Some Key Design decisions:
- `Contacts` table has an attribute `contact_id` which is the uuid of the user who is being added as a contact. Initially, it will be NULL since we cannot verify if user exists as we cannot access `auth.users` schema from client-SDK. However while fetching contacts for __channel creation__ we will only display those whose `contact_id` is not NULL. Whenever a new user is created, we update the contacts table to find users who have the former's info listed and update the `contact_id` from NULL to the actual value. This is not an __IDEAL__ situation. The correct approach would be to verify the same server-side, but that is for future development. Another way can be to make a separate `public.users` table but that negates all benefits of Supabase managing the Auth by itself so we won't do that. To handle the case where the contact already exists, we can update `contact_id` when that user logs in.

- Previously, for new messages, we would send a write request to the DB. Simultaneouly, we were also listening for changes to the DB. Whenever a new message arrived, we would render it. This meant that even for own messages we would wait for changes to the DB. This was not noticeable when it was just messages but __EXTREMELY__ noticable when media was involved as well as:
  - We would upload media 
  - We would send message write request
  - We would listen for this new change
  - We would re-download the image we already had locally to display it.
This was not an effective use of time and bandwidth so we switched to optimistic rendering of new messages. However, we need to account for disruptions and failures which would be addressed in future updates.

- Ignore the use of `we` instead of `i` in this documentation, even though its a one-man project, I am used to writing `we` as i usually work together with other devs.

### Features:
- Realtime Chat messaging (duh!)
- Route protection
- Media Sharing
- Optimistic Rendering
- Message Reply, Forwarding, etc