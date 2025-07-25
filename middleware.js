import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {

    const path = request.nextUrl.pathname

    const isPublicpath = path=="/login" || path == "/sign-up" || path=="/verify-email"

    const token = request.cookies.get("token")?.value || ""

    if(isPublicpath && token){
        return NextResponse.redirect(new URL('/visualize', request.url))
    }

    if(!isPublicpath && !token){
        return NextResponse.redirect(new URL('/login', request.url))
    }

}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher:["/","/login","/sign-up","/profile","/verify-email","/visualize/:path*"],
}