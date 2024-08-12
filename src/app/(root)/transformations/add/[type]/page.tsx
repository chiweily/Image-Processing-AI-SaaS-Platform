import Header from '@/components/shared/Header'
import TransformationForm from '@/components/shared/TransformationForm'
import { transformationTypes } from '@/constants/index'
import { getUserById } from '@/lib/actions/user.actions'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

const AddTransformationTypePage = async( {params: {type}}: SearchParamProps) => {
  const transformation = transformationTypes[type]
  const { userId } = auth()

  // 若 userId 不存在，则重定向至 sign-in 界面
  if(!userId) redirect('/sign-in')

  // 从数据库中获取 userId
  const user = await getUserById(userId)

  return (
    <>
      <Header
      title={transformation.title}
      subtitle={transformation.subTitle}
      />

      <TransformationForm 
        action='Add' 
        userId={user._id}
        type={transformation.type as TransformationTypeKey}
        creditBalance={user.creditBalance} 
      />
      
    </>
  ) 
}

export default AddTransformationTypePage