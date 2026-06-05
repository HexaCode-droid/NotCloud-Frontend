import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('token');
  const isAuthRoute = event.url.pathname.startsWith('/auth');

  if (!token && !isAuthRoute) {
    throw redirect(303, '/auth/login');
  }

  if (token && isAuthRoute) {
    throw redirect(303, '/');
  }

  return resolve(event);
};
