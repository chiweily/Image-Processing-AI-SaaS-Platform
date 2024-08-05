'use client'

import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"
import Link from 'next/link'
import Image from 'next/image'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { navLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'
  

const MobileNav = () => {
    const pathname  = usePathname()

    return (
        <header className='header'>
            <Link href='/' className='flex items-center gap-2 md:py-2'>
                <Image 
                    alt='logo'
                    src='/assets/images/logo-text.svg'
                    width={180}
                    height={28}
                />
            </Link>

            <nav className='flex gap-2'>
            <SignedIn>
                <UserButton />
                <Sheet>
                    <SheetTrigger>
                        <Image 
                        alt='menu'
                        src='/assets/icons/menu.svg'
                        width={32}
                        height={32}
                        className='cursor-pointer'
                        />
                    </SheetTrigger>
                    <SheetContent side={'left'} className='sheet-content sm:w-64'>
                        <>
                            <Image 
                            alt='logo'
                            src='/assets/images/logo-text.svg'
                            width={152}
                            height={23}
                            />
                            <ul className='header-nav_elements'>
                                {navLinks.map((link) => {
                                const isActive = link.route === pathname

                                return (
                                    <li key={link.route} 
                                        className={`${isActive && 'gradient-text'} p-18 flex bg-green-400 text-dark-700` }    
                                    >
                                        <Link className='sidebar-link cursor-pointer' href={link.route}>
                                            <Image 
                                                src={link.icon} 
                                                alt='logo' 
                                                width={24} 
                                                height={24}
                                            />
                                            {link.label}
                                        </Link>
                                    </li> 
                                )
                                })}
                                <li className='flex-center cursor-pointer gap 2 p-4'>
                                    <UserButton showName />
                                </li>
                                </ul>
                        </>
                    </SheetContent>
                </Sheet>

            </SignedIn>

            <SignedOut>
              <Button asChild className='button bg-purple-400'>
                <Link href='/sign-in'>登陆</Link>
              </Button>
            </SignedOut>
            </nav>
        </header>
    )
}

export default MobileNav
