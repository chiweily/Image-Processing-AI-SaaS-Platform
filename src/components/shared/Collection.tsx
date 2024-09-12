'use client'

import React from 'react'
import {
    Pagination,
    PaginationContent,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
import { IImage } from '@/lib/database/models/image.model'
import Search from './Search'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { formUrlQuery } from '@/lib/utils'
import { Button } from '../ui/button'
import Link from 'next/link'
import { CldImage } from 'next-cloudinary'
import Image from 'next/image'
import { transformationTypes } from '@/constants'
  

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
  const router = useRouter()
  const searchParams = useSearchParams()

  // 分页
  const onPageChange = (action: string) => {
    // 根据action的值判断是向前翻页还是向后翻页
    const pageValue = action === 'next' ? Number(page) + 1 : Number(page) - 1
    // 创建新的URL查询参数对象，返回新的URL字符串
    const newUrl = formUrlQuery({
        searchParams: searchParams.toString(),
        key: 'page',
        value: pageValue
    })

    // 新的url页面设置为不滚动到页面顶部
    router.push(newUrl, {scroll: false})
  }

  return (
    <>
        <div className='collection-heading'>
            <h2 className='h2-bold text-dark-600'>Recent Edits</h2>
            {hasSearch && <Search />}
        </div>

        {images.length > 0 ? (
            <ul>
                {images.map((image) => (
                    <Card image={image} key={image.author._id} />
                ))}
            </ul>
        ) : (
            <div className='collection-empty'>
                <p className='p-20-semibold'>Empty List</p>
            </div>
        )}

        {totalPages > 1 && (
            <Pagination className='mt-10'>
                <PaginationContent className='flex w-full'>
                    <Button
                        disabled={Number(page) <= 1}
                        className='collection-btn'
                        onClick={() => onPageChange('prev')}
                    >
                        <PaginationPrevious className='hover:bg-transparent hover:text-white'/>
                    </Button>

                    <p className='flex-center p-16-medium w-fit flex-1'>
                        {page} / {totalPages}
                    </p>

                    <Button
                        className='button w-32 bg-purple-gradient bg-cover text-white'
                        onClick={() => onPageChange('next')}
                        disabled={Number(page) >= totalPages}
                    >
                        <PaginationNext className='hover:bg-transparent hover:text-white'/>
                    </Button>
                </PaginationContent>
            </Pagination>
        )}


    </>
  )
}

const Card = ({image} : {image: IImage}) => {
    return (
        <li>
            <Link href={`/transformations/${image.author._id}`} className='collection-card'>
            <CldImage 
                src={image.publicId}
                alt={image.title}
                width={image.width}
                height={image.height}
                {...image.config}
                loading='lazy'
                className='h-52 w-full rounded-[10px] object-cover'
                sizes='(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw'
            />
            <div className='flex-between'>
                <p className='p-20-semibold mr-3 line-clamp-1 text-dark-600'>
                    {image.title}
                </p>
                {/* todo */}
                <Image 
                    src={`/assets/icons/${transformationTypes[image.transformationType as TransformationTypeKey].icon}`}
                    alt={image.title}
                    width={24}
                    height={24}
                />
            </div>
        </Link>
        </li>
    )
}
