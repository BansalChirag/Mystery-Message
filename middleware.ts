import { getToken } from "next-auth/jwt";
import { NextRequest} from "next/server";
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, privateRoutes } from "./route";

export async function middleware(request: NextRequest){
    const {nextUrl} = request
    const token = await getToken({req: request});
    const isLoggedIn =!!token

    const isApiRoute = apiAuthPrefix.some(prefix => nextUrl.pathname.startsWith(prefix))
    
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)
    
    const isPrivateRoute = privateRoutes.includes(nextUrl.pathname)

    if(isApiRoute) {
        return null
    };

    if(isAuthRoute){
        if(isLoggedIn){
           return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT,nextUrl))  
        }
        return null;
    }

    if(isPrivateRoute){
        if(!isLoggedIn){
            return Response.redirect(new URL("/login",nextUrl))
        }
        return null;
    }

    return null;

}

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};