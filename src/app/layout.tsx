import "./globals.css"
import { Inter } from "next/font/google"

import NavbarContainer from "@/components/Navbar/NavbarContainer"
import NavbarLinksContainer from "@/components/Navbar/NavbarLinksContainer"
import NavbarLink from "@/components/Navbar/NavbarLink"

export const metadata = {
  title: "RiskThinking - Work Sample",
  description: "Generated by create next app",
}
const inter = Inter({
  variable: "--font-inter",
  display: "swap",
  subsets: ["latin"],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} font-inter tracking-tight`}>
      <body className="min-h-screen">
        <>
          <NavbarContainer>
            {/* Some of the PrimeReact's Data Table's CSS doesn't get rendered properly if you use a NextJS Link lol */}
            <h1 className="text-2xl font-bold tracking-tighter ">
              <a href="/">
                <span className="text-[#feac1d]">risk</span>
                <span className="font-light">thinking</span>
                <span className="text-[#feac1d]">.AI</span>
              </a>
            </h1>

            <NavbarLinksContainer>
              <NavbarLink url="/map" link="Map"></NavbarLink>
              <NavbarLink url="/chart" link="Chart"></NavbarLink>

              {/* Some of the PrimeReact's Data Table's CSS doesn't get rendered properly if you use a NextJS Link lol */}
              <a
                href="/table"
                className="relative block select-none tracking-tight outline-none before:absolute before:-bottom-1.5 before:h-0.5 before:w-full before:origin-left before:scale-x-0 before:bg-[#feac1d] before:transition hover:before:scale-100"
              >
                Table
              </a>
            </NavbarLinksContainer>
          </NavbarContainer>
          {children}
        </>
      </body>
    </html>
  )
}
