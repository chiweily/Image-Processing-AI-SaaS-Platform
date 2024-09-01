'use client'

import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation'
import Image from 'next/image'
  

const InsufficientCreditsModal = () => {
    const router = useRouter()


    return (
        <AlertDialog defaultOpen> 
            
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className='flex-between'>
                        <p className='p-16-semibold text-dark-400'>
                            Insufficient Credits
                        </p>
                        <AlertDialogCancel
                            className='border-0 p-0 hover: bg-transparent'
                            onClick={() => router.push('/profile')}
                        >
                            <Image 
                                src='/assets/icons/close.svg'
                                alt='credit coins'
                                width={24}
                                height={24}
                                className='cursor-pointer'
                            />
                        </AlertDialogCancel>
                    </div>

                    <Image 
                        src='/assets/images/stacked-coins.png'
                        alt='credit coins'
                        width={462}
                        height={122}
                    />

                    <AlertDialogTitle className='p-24-bold text-dark-600'>
                        Oops...Looks like you&#39;ve run out of credits!
                    </AlertDialogTitle>

                    <AlertDialogDescription className='p-16-regular py-3'>
                        No worries, though - you can always upgrade your account to get more credits.
                    </AlertDialogDescription>

                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel 
                        className='button w-full bg-purple-100 text-dark-400'
                        onClick={() => router.push('/profile')}
                    >
                        No, Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className='button w-full bg-purple-gradient bg-cover'
                        onClick={() => router.push('/credits')}
                    >
                        Yes, Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default InsufficientCreditsModal
