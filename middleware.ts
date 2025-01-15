import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/(auth)/auth/[...nextauth]/options";
export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/profile/:path*',
    '/sign-in',
    '/sign-up',
    '/',
    '/verify/:path*',
    '/clubs/:path*', 
    '/events/:path*', 
    '/resources/:path*',
    '/user/:path*',
    '/issues/:path*'
  ],
};

export async function middleware(request: NextRequest) {
  const session = await getServerSession(authOptions)
  console.log(session);
  const url = request.nextUrl;

  if (
    session &&
    (url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify'))
  ) {
    if (session.user.isTeacher) {
      return NextResponse.redirect(new URL('/profile/teacher', request.url));
    } else {
      return NextResponse.redirect(new URL('/profile/student', request.url));
    }
  }

  if (!session && url.pathname.startsWith('/profile')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (
    !session &&
    (url.pathname.startsWith('/clubs') || url.pathname.startsWith('/events') || url.pathname.startsWith('/resources')|| url.pathname.startsWith('/events') || url.pathname.startsWith('/issues'))
  ) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (
    !session?.user?.sid_verification &&
    url.pathname.startsWith('/profile/student')
  ) {
    return NextResponse.redirect(
      new URL('/verify-sid/${token?.username}, request.url')
    );
  }

  return NextResponse.next();
}