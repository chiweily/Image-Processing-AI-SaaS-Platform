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
  console.log('Webhook received:', eventType);

    // CREATE
  if (eventType === "user.created") {
    try {
      const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

      const email = (email_addresses && email_addresses.length > 0) 
      ? email_addresses[0].email_address 
      : "no-email@example.com"; // 提供默认值或处理无 email 的情况

      const user = {
        clerkId: id,
        email: email,
        username: username || "defaultUsername",  // 如果 username 为空，则使用默认值
        firstName: first_name || "FirstName",     // 同样可以为 firstName 设置默认值
        lastName: last_name || "LastName",
        photo: image_url,
      };

      console.log('尝试创建用户:', evt.data.id);
      const newUser = await createUser(user);
      console.log('用户创建成功: ', newUser);

      // Set public metadata
      if (newUser) {
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: {
            userId: newUser._id,
          },
        });
      }

      return NextResponse.json({ message: "OK", user: newUser });
    } catch (error) {
      console.error('Error in user creation webhook:', error);
      return NextResponse.json({ message: "Error" }, { status: 500 });
    }
  }

  // UPDATE
  if (eventType === "user.updated") {
    const { id, image_url, first_name, last_name, username } = evt.data;

    const user = {
      username: username || "defaultUsername",  
      firstName: first_name || "FirstName",     
      lastName: last_name || "LastName",
      photo: image_url,
    };

    const updatedUser = await updateUser(id, user);

    return NextResponse.json({ message: "OK", user: updatedUser });
  }

  // DELETE
  if (eventType === "user.deleted") {
    const { id } = evt.data;

    const deletedUser = await deleteUser(id!);

    return NextResponse.json({ message: "OK", user: deletedUser });
  }

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  return new Response("", { status: 200 })
}