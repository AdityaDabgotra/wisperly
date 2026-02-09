'use client'

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { User } from 'next-auth'

const Navbar = () => {
  const { data: session } = useSession()
  const user = session?.user as (User & { username?: string }) | undefined

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold text-gray-900 tracking-tight"
        >
          Wisperly
        </Link>

        {/* Right section */}
        <div className="flex items-center gap-6">
          {session ? (
            <>
              <span className="text-gray-700 font-medium">
                Welcome,{" "}
                <span className="text-gray-900 font-semibold">
                  {user?.username ?? user?.name ?? user?.email}
                </span>
              </span>

              <button
                onClick={() => signOut()}
                className="px-4 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/signIn"
              className="px-5 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
            >
              Signin
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
