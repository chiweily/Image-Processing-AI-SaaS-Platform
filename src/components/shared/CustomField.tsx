import React from 'react'
import { z } from "zod"
import { Control } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {formSchema} from './TransformationForm'

// 定义 CustomField 组件的属性类型
// control: 表单控制器，用于管理表单状态
// render: 渲染函数，接收一个包含 field 属性的对象并返回 React 节点
// name: 表单字段名称，必须是 formSchema 推断类型的键
// formLabel: 表单字段的标签，可选
// className: 组件的 CSS 类名，可选
type CustomFieldProps = {
    control: Control<z.infer<typeof formSchema>> | undefined;
    render: (props: { field: any }) => React.ReactNode;
    name: keyof z.infer<typeof formSchema>;
    formLabel?: string;
    className?: string;
}

const CustomField = ({
    control,
    render,
    name,
    formLabel,
    className,
  }: CustomFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {formLabel && <FormLabel>{formLabel}</FormLabel>}
          <FormControl>{render({ field })}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default CustomField
