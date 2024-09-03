'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'

import { useRouter, useSearchParams } from 'next/navigation'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils'

const Search = () => {
  const [query, setQuery] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if(query) {
        const newUrl = formUrlQuery({
          searchParams: searchParams.toString(),
          key: 'query',
          value: query
        })
        router.push(newUrl, {scroll: false})
      } else {
        const newUrl = removeKeysFromQuery({
          searchParams: searchParams.toString(),
          keysToRemove: ['query']
        })
        router.push(newUrl, {scroll: false})
      }
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [router, searchParams, query])


  return (
    <div className='search'>
      <Image 
        alt='search'
        src='/assets/icons/search.svg'
        width={24}
        height={24}
      />

      <Input 
        className='search-field'
        placeholder='Search'
        onChange={(e) => console.log(e.target.value)}
      />
    </div>
  )
}

export default Search
