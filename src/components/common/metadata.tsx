import { type Metadata } from "next"

import { PRODUCTION_CANONICAL_URL } from "@/config/constants"

export const siteMetadata: Metadata = {
  metadataBase: new URL(PRODUCTION_CANONICAL_URL),
  title: "Site Name",
  description: "",
  alternates: { canonical: PRODUCTION_CANONICAL_URL },
  applicationName: "Site Name",
  authors: [{ name: "Site Name Team", url: PRODUCTION_CANONICAL_URL }],
  generator: "Next.js",
  keywords: "online farm, farming, agriculture, digital ecosystem, technology, digital farm, digital agriculture",
  referrer: "origin",
  creator: "Site Name Team",
  publisher: "Site Name Team",
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    url: PRODUCTION_CANONICAL_URL,
    title: "Site Name",
    description: "",
    siteName: "Site Name",
    images: [
      {
        url: "/images/packs/6.png"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@site",
    creator: "@creator",
    images: "/images/packs/6.png"
  },
  appleWebApp: { capable: true, title: "Site Name", statusBarStyle: "black-translucent" },
  icons: [
    { rel: "shortcut icon", url: "/favicons/favicon.ico" },
    { rel: "apple-touch-icon", url: "/favicons/apple-touch-icon.png" },
    { rel: "mstile", sizes: "150x150", url: "/favicons/mstile-150x150.png" },
    { rel: "mask-icon", url: "/favicons/safari-pinned-tab.svg", color: "#f7a418" },
    { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicons/favicon-16x16.png" },
    { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicons/favicon-32x32.png" },
    { rel: "android-chrome", type: "image/png", sizes: "192x192", url: "/favicons/android-chrome-192x192.png" },
    { rel: "android-chrome", type: "image/png", sizes: "512x512", url: "/favicons/android-chrome-512x512.png" }
  ]
}
