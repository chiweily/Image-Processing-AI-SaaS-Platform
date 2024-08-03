'use client'

import { navLinks } from '@/constants'
import { SignedIn } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Sidebar = () => {
  const pathname  = usePathname()

  return (
    <div>
      <aside className='sidebar'>
        <div className='flex size-full flex-col gap-4'>

          <Link href='/' className='sidebar-logo' passHref>
            <Image src='/assets/images/logo-icon.svg' alt='logo' width={180} height={30}/>
          </Link>

          <nav className='sidebar-nav'>
            <SignedIn>
              <ul className='sidebar-nav_elements'>
                {navLinks.map((link) => {
                  const isActive = link.route === pathname


                  return (
                    <li key={link.route} className={`sidebar-nav_elements group ${
                      isActive ? 'bg-purple-gradient text-red-400' : 'text-gray-400'
                    }`}>
                      
                      <Link className='sidebar-link' href={link.route}>
                        <Image 
                          src={link.icon} 
                          alt='logo' 
                          width={24} 
                          height={24}
                          className={`${isActive && 'brightness-200'}`}
                          />
                        {link.label}
                      </Link>
                      
                    </li> 
                  )
                })}
              </ul>
            </SignedIn>

          </nav>

        </div>
      </aside>
    </div>
  )
}

export default Sidebar
  