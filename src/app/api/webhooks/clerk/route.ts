import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server'
import { createUser, deleteUser, updateUser } from '@/lib/actions/user.actions'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    console.error('请在 .env 文件中设置 WEBHOOK_SECRET 环境变量')
    return new Response('配置错误', {
      status: 500
    })
  }

  /**
   * @param svix_id: 每个 webhook 请求的唯一 ID
   * @param svix_timestamp: 每个 webhook 请求的时间戳
   * @param svix_signature: 验证 webhook 请求真实性的签名
   */
  
  const headerPayload = headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('错误！没有 svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)
  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  // 获取 id 和事件类型
  const { id } = evt.data
  const eventType = evt.type

  try {
    switch (eventType) {
      case 'user.created':
        return await handleUserCreated(evt.data)
      case 'user.updated':
        return await handleUserUpdated(evt.data)
      case 'user.deleted':
        return await handleUserDeleted(evt.data)
      default:
        console.log(`Unhandled event type: ${eventType}`)
        return new Response('Unsupported event type', {
          status: 400
        })
    }
  } catch (error) {
    console.error(`Error processing ${eventType} event:`, error)
    return new Response('Error processing event', {
      status: 500
    })
  }

  // create user
  async function handleUserCreated(data: any) {
    const { id, email_addresses, image_url, first_name, last_name, username } = data
    console.log('webhook触发，用户数据：', evt.data)
    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username!,
      firstName: first_name as string,
      lastName: last_name as string,
      photo: image_url,
    }

    // 提取相关信息后创建新用户
    console.log('创建新用户: ', user)
    const newUser = await createUser(user)
    console.log('新用户创建成功:', newUser)

    // 将 clerkID 和数据库中的 ID 合并
    if (newUser) {
      const updatedUser = await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id,
        }
      })
      console.log('clerk用户已更新: ', updatedUser)
    }

    return NextResponse.json({ message: 'User created', user: newUser })
  }
  

  // update user info
  async function handleUserUpdated(data: any) {
    const { id, image_url, first_name, last_name, username } = data
    const user = {
      firstName: first_name as string,
      lastName: last_name as string,
      username: username!,
      photo: image_url,
    }

    const updatedUser = await updateUser(id, user)
    return NextResponse.json({ message: 'User updated', user: updatedUser })
  }


  // delete user
  async function handleUserDeleted(data: any) {
    const { id } = data
    const deletedUser = await deleteUser(id!)

    return NextResponse.json({ message: 'User deleted', user: deletedUser })
  }
}