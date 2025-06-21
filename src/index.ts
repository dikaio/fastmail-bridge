import { Hono } from 'hono'
import { cors } from 'hono/cors'
import nodemailer from 'nodemailer'
import type { SendMailOptions } from 'nodemailer'

const app = new Hono()

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.fastmail.com'
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465')
const SMTP_SECURE = process.env.SMTP_SECURE !== 'false'
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const API_KEY = process.env.API_KEY
const PORT = parseInt(process.env.PORT || '3000')

if (!SMTP_USER || !SMTP_PASS || !API_KEY) {
  console.error('Missing required environment variables: SMTP_USER, SMTP_PASS, or API_KEY')
  process.exit(1)
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
})

app.use('/*', cors())

app.use('/api/*', async (c, next) => {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Missing or invalid authorization header' }, 401)
  }
  
  const token = authHeader.substring(7)
  
  if (token !== API_KEY) {
    return c.json({ error: 'Invalid API key' }, 401)
  }
  
  await next()
})

interface EmailRequest {
  to: string | string[]
  from?: string
  subject: string
  text?: string
  html?: string
  cc?: string | string[]
  bcc?: string | string[]
  replyTo?: string
  attachments?: Array<{
    filename: string
    content: string
    encoding?: string
  }>
}

app.get('/', (c) => {
  return c.json({ 
    status: 'ok',
    service: 'Fastmail Bridge',
    version: '1.0.0'
  })
})

app.get('/health', (c) => {
  return c.json({ status: 'healthy' })
})

app.post('/api/send', async (c) => {
  try {
    const body = await c.req.json<EmailRequest>()
    
    if (!body.to || !body.subject) {
      return c.json({ error: 'Missing required fields: to, subject' }, 400)
    }
    
    if (!body.text && !body.html) {
      return c.json({ error: 'Either text or html content is required' }, 400)
    }
    
    const mailOptions: SendMailOptions = {
      from: body.from || SMTP_USER,
      to: body.to,
      subject: body.subject,
      text: body.text,
      html: body.html,
      cc: body.cc,
      bcc: body.bcc,
      replyTo: body.replyTo,
      attachments: body.attachments,
    }
    
    const info = await transporter.sendMail(mailOptions)
    
    return c.json({
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    })
  } catch (error) {
    console.error('Error sending email:', error)
    return c.json({ 
      error: 'Failed to send email', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, 500)
  }
})

await transporter.verify().catch((error) => {
  console.error('SMTP connection failed:', error)
  console.error('Please check your Fastmail credentials and settings')
  process.exit(1)
})

console.log('SMTP connection verified successfully')
console.log(`Server is running on port ${PORT}`)

export default {
  port: PORT,
  fetch: app.fetch,
}