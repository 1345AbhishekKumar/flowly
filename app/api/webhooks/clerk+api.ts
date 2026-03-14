import { Webhook } from 'svix';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('Missing CLERK_WEBHOOK_SECRET');
    return new Response('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env', {
      status: 500,
    });
  }

  // Get the headers
  const svix_id = req.headers.get('svix-id');
  const svix_timestamp = req.headers.get('svix-timestamp');
  const svix_signature = req.headers.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Error occured -- no svix headers');
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  // Get the incoming payload as raw text for signature verification
  let body: string;
  try {
    body = await req.text();
  } catch (err) {
    console.error('Error reading raw body', err);
    return new Response('Error reading body', { status: 400 });
  }

  // Parse payload to JSON for our own use later
  const payload = JSON.parse(body);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id: clerk_id, email_addresses, first_name, last_name, image_url, created_at } = evt.data;

    const email = email_addresses && email_addresses.length > 0 ? email_addresses[0].email_address : '';
    const name = [first_name, last_name].filter(Boolean).join(' ');

    // Upsert to Supabase
    const { data, error } = await supabaseAdmin
      .from('users')
      .upsert({
        clerk_id: clerk_id,
        email: email,
        name: name,
        profile_image: image_url,
      }, { onConflict: 'clerk_id' })
      .select()
      .single();

    if (error) {
      console.error('Error syncing user to Supabase:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, user: data }), { status: 200 });
  }

  if (eventType === 'user.deleted') {
    const { id: clerk_id } = evt.data;

    if (!clerk_id) {
      console.error('No ID provided in the user.deleted event');
      return new Response('Error: No User ID', { status: 400 });
    }

    // Delete from Supabase. We add .select() to return the deleted row.
    const { data, error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('clerk_id', clerk_id)
      .select();

    if (error) {
      console.error('Error deleting user from Supabase:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    // If data is empty, it means no row matched the clerk_id
    if (!data || data.length === 0) {
      console.warn(`Webhook received user.deleted for clerk_id ${clerk_id}, but no matching user was found in Supabase.`);
      return new Response(JSON.stringify({ success: true, message: 'No matching user found' }), { status: 200 });
    }

    console.log(`Successfully deleted user ${clerk_id} from Supabase.`);
    return new Response(JSON.stringify({ success: true, deletedData: data }), { status: 200 });
  }

  // Acknowledge other event types without error
  return new Response('', { status: 200 });
}
