import React from 'react'
import { Toast } from '../ui/toast'
import { useToast } from '../ui/use-toast'
import { CldImage, CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import { dataUrl, getImageSize } from '@/lib/utils'
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props'

type MediaUploaderProps ={
    onValueChange: (value: string) => void
    setIamge: React.Dispatch<any>
    publicId: string
    image: any
    type: string
}

const MediaUploader = ({
    onValueChange,
    setIamge,
    publicId,
    image,
    type
}: MediaUploaderProps) => {
  const { toast } = useToast()

  // 上传成功
  const onUploadSuccessHandler = (result: any) => {
    setIamge((prevState: any) => ({
        ...prevState,
        publicId: result?.info?.public_id,
        width: result?.info?.width,
        height: result?.info?.height,
        secureUrl: result?.info?.secure_url,
    }))
    onValueChange(result?.info?.public_id)


    toast({
        title: '上传成功',
        description: '1分已从您的账户中扣除',
        className: 'success-toast',
        duration: 5000,
    })
  }

  // 上传失败
  const onUploadErrorHandler = () => {
    toast({
        title: '上传失败',
        description: '请重试',
        className: 'error-toast',
        duration: 5000,
    })
  }

  return (
    <CldUploadWidget
        uploadPreset='imaginary_platform'
        options={{
            multiple: false,
            resourceType: 'image',
        }}
        onSuccess={onUploadSuccessHandler}
        onError={onUploadErrorHandler}
    >
        {({open}) => (
            <div className='flex flex-col gap-4'>
                <h3 className='h3-bold text-dark-600'>Original</h3>

                {publicId ? (
                    <>
                        {/* HERE IS THE IMAGE */}
                        <div className='cursor-pointer overflow-hidden rounded-[10px]'>
                            <CldImage 
                                alt='image'
                                src={publicId}
                                width={getImageSize(type, image, 'width')}
                                height={getImageSize(type, image, 'height')}
                                sizes={'(max-width: 76px) 100vw, 50vw'}
                                placeholder={dataUrl as PlaceholderValue}
                                className='media-uploader_cldImage'
                            />
                        </div>
                    </>
                ) : (
                        <div className='media-uploader_cta' onClick={() => open()}>
                            <div className='media-uploader_cta-image'>
                                <Image 
                                    alt='添加图片'
                                    src='/assets/icons/add.svg'
                                    width={24}
                                    height={24}
                                /> 
                            </div>
                            <p className='p-14-medium'>上传图片</p>
                        </div>

                    )
                }

            </div>
        )}
    </CldUploadWidget>
  )
}

export default MediaUploader
