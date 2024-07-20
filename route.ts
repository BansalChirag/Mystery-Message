/**
** An array of routes that are accessible to the public 
** these do not require authentication
*/
export const publicRoutes = [
    "/u/:path*",
]


/**
** An array of routes that are used for authentication
** these routes will redirect logged in users to /dashboard 
*/
export const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
]

/**
** An array of routes that are accessible to only the login users
*/

export const privateRoutes = [
    "/dashboard",
]


/**
** The prefix of api authentication routes
** Routes that start with this prefix are used for authentication purposes
*/

export const apiAuthPrefix = [
    '/api/:path*',
]


/**
** The default redirect path after logging in
** 
*/

export const DEFAULT_LOGIN_REDIRECT = "/dashboard"