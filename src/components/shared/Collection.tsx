'use client'

import React from 'react'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
import { IImage } from '@/lib/database/models/image.model'
import Search from './Search'
  

export const Collection = ({
    hasSearch = false,
    images,
    totalPages = 1,
    page
} : {
    images: IImage[];
    totalPages?: number;
    page: number;
    hasSearch?: boolean;
}) => {


  return (
    <>
        <div className='collection-heading'>
            <h2 className='h2-bold text-dark-600'>Recent Edits</h2>
            {hasSearch && <Search />}
        </div>

        {images.length > 0 ? (
            <ul>
                {images.map((image) => (
                    <Card image={image} key={image._id} />
                ))}
            </ul>
        ) : (
            <div className='collection-empty'>
                <p className='p-20-semibold'>Empty List</p>
            </div>
        )}
    </>
  )
}
