'use client'

import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import { CldImage, getCldImageUrl } from 'next-cloudinary'
import { dataUrl, debounce, download, getImageSize } from '@/lib/utils'
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props'
import useIcons from '@/hooks/useIcons'

const TransformedImage = ({
  image, 
  type,
  title,
  transformationConfig,
  isTransforming,
  setIsTransforming,
  hasDownload = false
}: TransformedImageProps) => {

  const icons = useIcons()

  // 下载转换后的图片
  const downloadHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    download(getCldImageUrl({
      width: image?.width,
      height: image?.height,
      src: image?.publicId,
      ...transformationConfig
    }), title)
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex-between'> 
        <h3 className='h3-bold text-dark-600'>
          Transformed
        </h3>

        {hasDownload && (
          <Button className='download-btn' onClick={downloadHandler}>
            <Image  
              src={icons['/assets/icons/download.svg']}
              alt='download'
              width={24}
              height={24}
              className='pb-[6px]'
            />
          </Button>
        )}

      </div>

      {image?.publicId && transformationConfig ? (
        <div className='relative'>
          <CldImage 
            alt={image?.title}
            src={image?.publicId}
            width={getImageSize(type, image, 'width')}
            height={getImageSize(type, image, 'height')}
            sizes={'(max-width: 76px) 100vw, 50vw'}
            placeholder={dataUrl as PlaceholderValue}
            className='transformed-image'
            onLoad={() => {
              setIsTransforming && setIsTransforming(false)
            }}
            onError={() => {
              debounce(() => {
                setIsTransforming && setIsTransforming(false)
              }, 8000)()
            }}
            {...transformationConfig}
          />

          {/* transforming时的效果 */}
          {isTransforming && (
            <div className='transforming-loader'>
              <Image 
                src={icons['/assets/icons/spinner.svg']}
                alt='spinner'
                width={50}
                height={50}
              />
              <p className='text-white/80'>Please wait...</p>
            </div>
          )}

        </div>
      ) : (
        <div className='transformed-placeholder'>
          Transformed Image
        </div>
      )}
        
    </div>
  )
}

export default TransformedImage
