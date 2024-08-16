'use client'

import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { aspectRatioOptions, defaultValues, transformationTypes } from '@/constants'
import CustomField from './CustomField'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AspectRatioKey } from '@/lib/utils'


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
  const [ isSubmitting, setisSubmitting] = useState(false)
  const [isTransforming, setisTransforming] = useState(false)
  const [transformationConfig, settransformationConfig] = useState(config)

  
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
 
  // submit handdler
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  } 

  const onSelectFieldHandler = (
    value: string, 
    onChangeField: (value: string) => void
  ) => {
    
  }

  const onInputChangeHandler = (
    fieldName: string,
    value: string,
    type: string,
    onChangeField: (value: string) => void
  ) => {

  }

  const onTransformationHandler = (

  ) => {

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                onValueChange={(value) => 
                  onSelectFieldHandler(value, field.onChange)}
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
