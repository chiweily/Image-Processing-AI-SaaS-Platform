'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form }from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from '@/constants'
import CustomField from './CustomField'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AspectRatioKey, debounce, deepMergeObjects } from '@/lib/utils'
import { updateCredits } from '@/lib/actions/user.actions'
import MediaUploader from './MediaUploader'
import TransformedImage from './TransformedImage'
import { getCldImageUrl } from 'next-cloudinary'
import { addImage, updateImage } from '@/lib/actions/image.actions'
import { useRouter } from 'next/navigation'
import InsufficientCreditsModal from './InsufficientCreditsModal'


// 表单验证
export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
})


const TransformationForm = ({ 
  action, 
  data = null,
  creditBalance,
  userId,
  type,
  config = null
} : TransformationFormProps) => {

  const transformationType = transformationTypes[type]
  const [image, setImage] = useState(data)
  const [newTransformation, setNewTransformation] = useState<Transformations | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTransforming, setIsTransforming] = useState(false)
  const [transformationConfig, setTransformationConfig] = useState(config)
  // 是否处于过渡 & 触发过渡
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  
  // 初始值设置
  // 若为 update，则使用 data 中的值作为初始值，否则为预定义的 defaultValue
  const initialValues = data && action === 'Update' ? {
    title: data?.title,
    aspectRatio: data?.aspectRatio,
    color: data?.color,
    prompt: data?.prompt, 
    publicId: data?.publicId,
  } : defaultValues
    
  // 表单定义
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  })
 
  // submit按钮定义
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    if(data || image) {
      const transformationUrl = getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId,
        ...transformationConfig
      })

      const imageData = {
        title: values.title,
        publicId: image?.publicId,
        transformationType: type,
        width: image?.width,
        height: image?.height,
        config: transformationConfig,
        secureURL: image?.secureURL,
        transformationURL: transformationUrl,
        aspectRatio: values.aspectRatio,
        prompt: values.prompt,
        color: values.color,
      }

      // 首次添加图片
      if(action === 'Add') {
        try {
          const newImage = await addImage({
            image: imageData,
            userId,
            path: '/'
          })

          if(newImage) {
            form.reset()
            setImage(data)
            router.push(`/transformations/${newImage._id}`)
          }
        } catch (error) {
          console.log(error)
        }
      }

      // 更新图片
      if(action === 'Update') {
        try {
          const updatedImage = await updateImage({
            image: {
              ...imageData,
              _id: data._id,
            },
            userId,
            path: `/transformations/${data._id}`
          })

          if(updatedImage) {
            router.push(`/transformations/${updatedImage._id}`)
          }
        } catch (error) {
          console.log(error)
        }
      }
    }

    setIsSubmitting(false)
  } 

  // 处理选择字段的变化
  const onSelectFieldHandler = (
    value: string, 
    onChangeField: (value: string) => void
  ) => {
    // 根据所选值获取图像尺寸信息
    const imageSize = aspectRatioOptions[value as AspectRatioKey]

    // 更新图像的状态
    setImage((prevState: any) => {
      return {
        ...prevState,
        width: imageSize.width,
        height: imageSize.height,
        aspectRatio: imageSize.aspectRatio,
    }})

    // 更新newTransformation的状态
    setNewTransformation(transformationType.config)

    return onChangeField(value)
  }


  // 处理输入字段的变化
  const onInputChangeHandler = (
    fieldName: string,
    value: string,
    type: string,
    onChangeField: (value: string) => void
  ) => {
    debounce(() => {
      // 更新newTransformation的状态
      setNewTransformation((prevState: any) => ({
        ...prevState,
        [type]: {
          ...prevState[type],
          [fieldName === 'prompt' ? 'prompt' : 'to']: value
        }
      }))
    }, 1000)()
    return onChangeField(value)
  }

  // 处理图像转换操作
  const onTransformationHandler = async() => {
    setIsTransforming(true) 
    // 合并两个对象，结果被setTransformationConfig调用，更新transformationConfig的状态
    setTransformationConfig(
      deepMergeObjects(newTransformation, transformationConfig)
    )

    // newTransformation为null，表明转换操作已完成
    setNewTransformation(null)

    // 触发转换操作
    // todo：需要更新creditfee
    startTransition(async() => {
      await updateCredits(userId, creditFee)
    })
  }

  
  useEffect(() => {
    if(image && (type === 'restore' || type === 'removeBackground')) {
      setNewTransformation(transformationType.config)
    } else {
      setNewTransformation(null)
    }
  }, [image, transformationType.config, type])


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* 信用余额不足时显示 */}
        {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />}
        <CustomField 
          control={form.control}
          name='title'
          formLabel='Image Title'
          render={({ field }) => (<Input {...field} className='input-field' />)}
          className='w-full'
        />

        {type === 'fill' && (
          <CustomField
            control={form.control}
            name='aspectRatio'
            formLabel='Aspect Ratio'
            className='w-full'
            render={({ field }) => (
              <Select
                onValueChange={(value) => onSelectFieldHandler(value, field.onChange)}
                value={field.value}
              >
                <SelectTrigger className="select-field">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(aspectRatioOptions).map((key) => (
                    <SelectItem key={key} value={key} className='select-item'>
                      {aspectRatioOptions[key as AspectRatioKey].label} 
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />)}

          {(type === 'remove' || type === 'recolor') && (
            <div className='prompt-field'>
              <CustomField
                control={form.control}
                className='w-full' 
                name='prompt'
                formLabel={
                  type === 'remove' ? 'Object to remove' : 'Object to recolor'
                }
                render={({ field }) => (
                  <Input
                    value={field.value}
                    className='input-field'
                    onChange={(e) => onInputChangeHandler(
                      e.target.value,
                      'prompt',
                      type,
                      field.onChange
                    )} 
                  />
                )}
              />

              {type === 'recolor' && (
                <CustomField 
                  control={form.control}
                  className='w-full'
                  name='color'
                  formLabel='Replacement Color'
                  render={({ field }) => (
                    <Input
                      value={field.value}
                      className='input-field'
                      onChange={(e) => onInputChangeHandler(
                        'color',
                        e.target.value,
                        'recolor',
                        field.onChange
                    )} 
                    />
                  )} 
              />)}
            </div>
          )}

          <div className='media-uploader-field'>
            <CustomField 
              control={form.control}
              name='publicId'
              className='flex size-full flex-col'
              render={({ field }) => (
                <MediaUploader 
                  onValueChange={field.onChange}
                  setIamge={setImage}
                  publicId={field.value}
                  image={image}
                  type={type}
                />
                )} 
            />

            <TransformedImage 
              image={image}
              type={type}
              title={form.getValues().title}
              isTransforming={isTransforming}
              setIsTransforming={setIsTransforming}
              transformationConfig={transformationConfig}
            />



          </div>

          <div className='felx flex-col gap-4'>
            <Button 
              type='button' 
              className='submit-button capitalize' 
              disabled={isTransforming || newTransformation === null}
              onClick={onTransformationHandler}
            >
              {isTransforming ? 'Transforming...' : 'Apply Transformation'}
            </Button>
            <Button 
              type='submit' 
              className='submit-button capitalize' 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Save Image'}
            </Button>
          </div>
          
      </form>
    </Form>
  )
}

export default TransformationForm
