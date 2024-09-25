import { clerkMiddleware } from '@clerk/nextjs/server'


// const isProtectedRoute = createRouteMatcher(['/api/webhooks/(.*)'])
// Make sure that the `/api/webhooks/(.*)` route is not protected here
/* export default clerkMiddleware((auth, req) => {
  if(isProtectedRoute(req)) auth().protect()
}) */

export default clerkMiddleware()

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}