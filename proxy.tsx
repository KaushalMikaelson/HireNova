import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';


const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/ai-cover-letter(.*)",
  "/interview(.*)",
  "/subscription(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const {userId} = await auth()

  if(!userId && isProtectedRoute(req)){
    const {redirectToSignIn} = await auth();
    return redirectToSignIn({
      
    })
  }
});
