import './globals.css';
// import "@component/blog/AllBlogs.css";
// import "@component/blog/Dashboard.css";
import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
import NavBar from "../components/nav/NavBar";
import MyProfilePic from "../components/header/MainHeader";
import Providers from "./providers";
import GeneralContextProvider from '@/components/context/GeneralContextProvider';
import MainHeader from "@/components/header/MainHeader";
import Footer from "@component/footer/Footer";
import InputContextProvider from "@context/InputTypeProvider"
import ErrorBoundary from "@/app/error";




export const metadata: Metadata = {
  metadataBase: new URL("https://main.dx5wvmbhcdn6z.amplifyapp.com/"),
  title: {
    default: "Blog Room",
    template: `%s | Blog Room`,

  },
  description: 'Generated by www.masterconnect.ca,Free Blog Creation for you. It provides templates that the user can use to become an effective blogger. The Blog Room hass all the effective tools for the blogger to fine-tune their skills in blogging. ',
  // verification: {
  //   google: 'OQ6Dp84IAi3mrQ4H7bz1rHkVDSn532jFujcjf9wmrYA',
  //   yandex: 'yandex',
  //   yahoo: 'yahoo',
  //   other: {
  //     name: ['masterultils@gmail.com', 'https://www.masterconnect.ca/contact'],
  //   },
  // },

  generator: "Next.js",
  applicationName: "garymasterconnect",
  referrer: "origin-when-cross-origin",
  keywords: ["The Blog Room, Free to use", "blogs for you", "web info", "free blog posts", " The World is Your Oyster", " Create Your Own Blog", "Gary's Blogs"],
  authors: [{ name: "Gary Wallace", url: "https://www.masterconnect.ca" }],
  // colorScheme:"light",
  creator: "Gary Wallace",
  publisher: "Gary Wallace",
  formatDetection: {
    email: true,
    address: false,
    telephone: true
  },
  openGraph: {
    title: "The Blog Room",
    description: 'Generated by www.masterconnect.ca, blogs for you',
    url: "http://localhost:8000",
    siteName: "The Blog Room",
    images: [
      {
        url: "/images/gb_logo.png",
        width: 600,
        height: 800
      },

    ],
    locale: "en-CA",
    type: "website"

  },
  robots: {
    index: false,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/icon.png',
    },

  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },

  appleWebApp: {
    title: 'Apple Web App',
    statusBarStyle: 'black-translucent',
    startupImage: [
      '/assets/startup/apple-touch-startup-image-768x1025.png',
      {
        url: '/assets/startup/apple-touch-startup-image-1536x2051.png',
        media: '(device-width: 768px) and (device-height: 1024px)',
      },
    ],
  },


}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">

      <body className={"mx-auto  dark:bg-slate-400 bg-slate-700 text-white w-full  "}>
        <Providers>
          <GeneralContextProvider>
            <InputContextProvider>
              <NavBar />
              <div className="mx-auto lg:container bg-slate-900 min-h-[100vh] relative">


                {/* <MainHeader /> */}


                {children}


              </div>
              <Footer />
            </InputContextProvider>
          </GeneralContextProvider>
        </Providers>
      </body>
    </html>
  )
}