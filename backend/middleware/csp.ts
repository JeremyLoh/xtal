import { NextFunction, Request, Response } from "express"

export function getContentSecurityPolicyMiddleware(
  _: Request,
  response: Response,
  next: NextFunction
) {
  // Needs to be identical to the frontend index.html CSP tag <meta http-equiv="content-security-policy"/>
  // Remove any invalid newline characters
  const csp =
    `default-src 'self';` +
    `style-src 'self' 'unsafe-inline';` +
    `script-src 'self' https://xtal-backend.onrender.com https://va.vercel-scripts.com;` +
    `media-src 'self' https:;` +
    `font-src 'self';` +
    `object-src 'none';` +
    `base-uri 'none';` +
    `frame-src 'self';` +
    `img-src 'self' https: blob: data: https://tile.openstreetmap.org/;` +
    `connect-src 'self' http://localhost:3000 https://xtal-backend.onrender.com https://qgntdhxjgegxcsnajywb.supabase.co https://va.vercel-scripts.com https://de2.api.radio-browser.info https://fi1.api.radio-browser.info;`
  response.setHeader("content-security-policy", csp)
  next()
}
