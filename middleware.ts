import { withAuth, type NextRequestWithAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    console.log("🚀 ~ file: middleware.ts:5 ~ middleware ~ request:", request)
    console.log(request.nextUrl.pathname)
    console.log(request.nextauth.token)
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        console.log("🚀 ~ file: middleware.ts:12 ~ token:", token)
        console.log("🚀 ~ file: middleware.ts:12 ~ req:", req)
        if (req.nextUrl.pathname === "/dashboard") {
          return token?.role === "admin"
        }

        if (req.nextUrl.pathname === "/assets") {
          return token?.role === "admin"
        }

        return Boolean(token)
      }
    }
  }
)

export const config = { matcher: ["/dashboard"] }
