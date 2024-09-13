
import { Collection } from '@/components/shared/Collection'
import { navLinks } from '@/constants'
import useIcons from '@/hooks/useIcons'
import { getAllImages } from '@/lib/actions/image.actions'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Home = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1
  const searchQuery = (searchParams?.query as string)  || ''
  const images = await getAllImages({ page, searchQuery })
  const icons = useIcons()

  return (
    <>
      <section className='home'>
        {/* todo: 1. 背景图片无法显示，在tailwind.config.js里设置 2. h1文字的颜色*/}
        <h1 className='home-heading bg-purple-300'>
          Unleash the power of AI with this paltform
        </h1>
        <ul className='flex-center w-full gap-20'>
          {navLinks.slice(1, 5).map((link) => (
            <Link
              href={link.route}
              key={link.route}
              className='flex-center flex-col gap-2'
            >
              <li className='flex-center w-fit rounded-full bg-white p-4'>
                <Image 
                  src={icons[link.icon as keyof typeof icons]}
                  alt='icon'
                  width={24}
                  height={24}
                />
              </li>
              <p className='p-14-medium text-center text-white'>{link.label}</p>
            </Link>
          ))

          }
        </ul>
      </section>

      <section className='sm:mt-12'>
       <Collection
          hasSearch={true}
          images={images?.data}
          totalPages={images?.totalPage}
          page={page}
       />
      </section>

    </>
  )
}

export default Home