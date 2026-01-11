import nodemailer from 'nodemailer'

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: process.env.EMAIL_SERVER_PORT === '465',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD
  }
})

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

/**
 * Send email
 */
export async function sendEmail(options: EmailOptions) {
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@deelbreaker.com',
      ...options
    })

    console.log('Email sent:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' }
  }
}

/**
 * Send deal alert email
 */
export async function sendDealAlertEmail(
  email: string,
  userName: string,
  dealTitle: string,
  dealDescription: string,
  discount: number,
  dealUrl: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #F3AF7B 0%, #F4C2B8 100%); padding: 20px; border-radius: 10px; color: white;">
        <h1 style="margin: 0;">🎉 Amazing Deal Alert!</h1>
      </div>
      
      <div style="padding: 20px; background: #f9f9f9;">
        <p>Hi ${userName},</p>
        
        <p>We found an amazing deal that matches your interests!</p>
        
        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #F3AF7B;">
          <h2 style="margin-top: 0; color: #333;">${dealTitle}</h2>
          <p style="color: #666;">${dealDescription}</p>
          <p style="font-size: 24px; color: #F3AF7B; font-weight: bold; margin: 10px 0;">
            ${discount}% OFF
          </p>
          <a href="${dealUrl}" style="display: inline-block; background: linear-gradient(135deg, #F3AF7B 0%, #F4C2B8 100%); color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; font-weight: bold;">
            View Deal
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          This deal is limited time only. Don't miss out!
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <p style="color: #999; font-size: 12px;">
          You're receiving this email because you have deal alerts enabled. 
          <a href="#" style="color: #F3AF7B; text-decoration: none;">Manage preferences</a>
        </p>
      </div>
    </div>
  `

  return sendEmail({
    to: email,
    subject: `🎉 ${discount}% OFF - ${dealTitle}`,
    html
  })
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(
  email: string,
  userName: string,
  orderNumber: string,
  dealTitle: string,
  quantity: number,
  totalPrice: number,
  discount: number
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #F3AF7B 0%, #F4C2B8 100%); padding: 20px; border-radius: 10px; color: white;">
        <h1 style="margin: 0;">✅ Order Confirmed!</h1>
      </div>
      
      <div style="padding: 20px; background: #f9f9f9;">
        <p>Hi ${userName},</p>
        
        <p>Thank you for your purchase! Your order has been confirmed.</p>
        
        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Order Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #666;">Order Number:</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right;">${orderNumber}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #666;">Product:</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right;">${dealTitle}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #666;">Quantity:</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right;">${quantity}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #666;">Discount:</td>
              <td style="padding: 10px 0; color: #F3AF7B; font-weight: bold; text-align: right;">-$${discount.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #333; font-weight: bold;">Total:</td>
              <td style="padding: 10px 0; color: #F3AF7B; font-weight: bold; font-size: 18px; text-align: right;">$${totalPrice.toFixed(2)}</td>
            </tr>
          </table>
        </div>
        
        <p style="color: #666;">
          Your order will be processed shortly. You'll receive a shipping confirmation email once your item ships.
        </p>
        
        <a href="#" style="display: inline-block; background: linear-gradient(135deg, #F3AF7B 0%, #F4C2B8 100%); color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; font-weight: bold;">
          Track Order
        </a>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <p style="color: #999; font-size: 12px;">
          Questions? <a href="mailto:support@deelbreaker.com" style="color: #F3AF7B; text-decoration: none;">Contact support</a>
        </p>
      </div>
    </div>
  `

  return sendEmail({
    to: email,
    subject: `Order Confirmation - ${orderNumber}`,
    html
  })
}

/**
 * Send cashback notification email
 */
export async function sendCashbackNotificationEmail(
  email: string,
  userName: string,
  cashbackAmount: number,
  totalCashback: number
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #F3AF7B 0%, #F4C2B8 100%); padding: 20px; border-radius: 10px; color: white;">
        <h1 style="margin: 0;">💰 Cashback Earned!</h1>
      </div>
      
      <div style="padding: 20px; background: #f9f9f9;">
        <p>Hi ${userName},</p>
        
        <p>Great news! You've earned cashback on your recent purchase.</p>
        
        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
          <p style="color: #666; margin: 0;">Cashback Earned</p>
          <p style="font-size: 36px; color: #F3AF7B; font-weight: bold; margin: 10px 0;">
            $${cashbackAmount.toFixed(2)}
          </p>
          <p style="color: #666; margin: 0;">Total Cashback: $${totalCashback.toFixed(2)}</p>
        </div>
        
        <p style="color: #666;">
          Your cashback has been added to your account and can be used on future purchases or withdrawn.
        </p>
        
        <a href="#" style="display: inline-block; background: linear-gradient(135deg, #F3AF7B 0%, #F4C2B8 100%); color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; font-weight: bold;">
          View Cashback
        </a>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <p style="color: #999; font-size: 12px;">
          Keep shopping to earn more cashback!
        </p>
      </div>
    </div>
  `

  return sendEmail({
    to: email,
    subject: `💰 You earned $${cashbackAmount.toFixed(2)} cashback!`,
    html
  })
}

/**
 * Send group buy update email
 */
export async function sendGroupBuyUpdateEmail(
  email: string,
  userName: string,
  dealTitle: string,
  currentParticipants: number,
  targetParticipants: number,
  currentPrice: number,
  originalPrice: number
) {
  const progressPercent = (currentParticipants / targetParticipants) * 100
  const discount = ((originalPrice - currentPrice) / originalPrice) * 100

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #F3AF7B 0%, #F4C2B8 100%); padding: 20px; border-radius: 10px; color: white;">
        <h1 style="margin: 0;">👥 Group Buy Update!</h1>
      </div>
      
      <div style="padding: 20px; background: #f9f9f9;">
        <p>Hi ${userName},</p>
        
        <p>Your group buy for <strong>${dealTitle}</strong> is progressing!</p>
        
        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Progress</h3>
          
          <div style="margin: 20px 0;">
            <div style="background: #f0f0f0; border-radius: 10px; height: 30px; overflow: hidden;">
              <div style="background: linear-gradient(90deg, #F3AF7B 0%, #F4C2B8 100%); height: 100%; width: ${progressPercent}%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                ${Math.round(progressPercent)}%
              </div>
            </div>
            <p style="margin: 10px 0; color: #666;">
              ${currentParticipants} of ${targetParticipants} participants
            </p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #666;">Current Price:</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #F3AF7B;">$${currentPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666;">Original Price:</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right;">$${originalPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666;">Discount:</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #F3AF7B;">${discount.toFixed(0)}% OFF</td>
            </tr>
          </table>
        </div>
        
        <p style="color: #666;">
          ${progressPercent < 100 
            ? `Keep sharing! We need ${targetParticipants - currentParticipants} more participants to unlock the best price.`
            : 'Congratulations! Your group buy target has been reached! 🎉'
          }
        </p>
        
        <a href="#" style="display: inline-block; background: linear-gradient(135deg, #F3AF7B 0%, #F4C2B8 100%); color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; font-weight: bold;">
          View Group Buy
        </a>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <p style="color: #999; font-size: 12px;">
          Share this deal with friends to help reach the target faster!
        </p>
      </div>
    </div>
  `

  return sendEmail({
    to: email,
    subject: `👥 Group Buy Update: ${dealTitle}`,
    html
  })
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetLink: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #F3AF7B 0%, #F4C2B8 100%); padding: 20px; border-radius: 10px; color: white;">
        <h1 style="margin: 0;">🔐 Reset Your Password</h1>
      </div>
      
      <div style="padding: 20px; background: #f9f9f9;">
        <p>We received a request to reset your password. Click the link below to create a new password:</p>
        
        <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #F3AF7B 0%, #F4C2B8 100%); color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; font-weight: bold; margin: 20px 0;">
          Reset Password
        </a>
        
        <p style="color: #666; font-size: 14px;">
          This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <p style="color: #999; font-size: 12px;">
          For security reasons, never share this link with anyone.
        </p>
      </div>
    </div>
  `

  return sendEmail({
    to: email,
    subject: 'Reset Your Deelbreaker Password',
    html
  })
}
