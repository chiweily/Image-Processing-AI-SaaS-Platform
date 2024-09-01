'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { Input } from '../ui/input'

const Search = () => {
  const [query, setQuery] = useState('')


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
