'use client'

import { navLinks } from '@/constants'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button'

const Sidebar = () => {
  const pathname  = usePathname()

  return (
    <div>
      <aside className='sidebar'>
        <div className='flex size-full flex-col gap-4'>

          {/* logo图标 */}
          {/* TODO: svg格式的图标无法渲染 */}
          <Link href='/' className='sidebar-logo' passHref>
            <Image src='/assets/images/logo-icon.svg' alt='logo' width={180} height={30}/>
          </Link>

          {/* 导航栏 */}
          <nav className='sidebar-nav'>
            <SignedIn>

              <ul className='sidebar-nav_elements'>
                {navLinks.slice(0, 6).map((link) => {
                  const isActive = link.route === pathname

                  // TODO: svg格式的图标无法渲染
                  return (
                    <li key={link.route} className={`sidebar-nav_element group ${
                      isActive ? 'bg-purple-200 text-gray-300' : 'text-gray-700'
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

                <ul className='sidebar-nav_elements'>
                  {navLinks.slice(6).map((link) => {
                    const isActive = link.route === pathname

                    // TODO: svg格式的图标无法渲染
                    return (
                      <li key={link.route} className={`sidebar-nav_element group ${
                        isActive ? 'bg-purple-200 text-gray-300' : 'text-gray-700'
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

                {/* TODO: afterSignedOut是否有替换？退出后仍然显示界面 */}
                <li className='flex-center cursor-pointer gap 2 p-4'>
                  <UserButton showName />
                </li>
              </ul>
            </SignedIn>

            <SignedOut>
              <Button asChild className='button bg-purple-400'>
                <Link href='/sign-in'>登陆</Link>
              </Button>
            </SignedOut>

          </nav>

        </div>
      </aside>
    </div>
  )
}

export default Sidebar
  