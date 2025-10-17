exports.registrationTemplate = (userName, userEmail, otp, expiresIn, fLink) => {
  return `
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Confirm Your Registration</title>
  <style>
    body { margin:0; padding:0; background:#f5f7fb; font-family: Arial, Helvetica, sans-serif; }
    .container { max-width:560px; margin:40px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05); }
    .header { background:#0d6efd; color:#ffffff; padding:20px; text-align:center; font-size:20px; font-weight:bold; }
    .content { padding:24px; color:#1f2937; line-height:1.6; }
    .otp-box { text-align:center; margin:24px 0 8px; }
    .otp { display:inline-block; letter-spacing:6px; font-family:"Courier New", Courier, monospace; font-size:28px; font-weight:700; color:#0d6efd; padding:12px 16px; border:2px dashed #0d6efd; border-radius:8px; }
    .meta { text-align:center; font-size:12px; color:#6b7280; margin-top:8px; }
    .btn-wrap { text-align:center; margin:20px 0 8px; }
    .btn { display:inline-block; background:#0d6efd; color:#ffffff !important; text-decoration:none; padding:12px 18px; border-radius:8px; font-weight:600; font-size:14px; }
    .footer { text-align:center; font-size:12px; color:#6b7280; padding:16px; background:#f9fafb; }
    @media (max-width:600px) { .otp { font-size:24px; letter-spacing:4px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      {{userName}} - Confirm Your Registration
    </div>
    <div class="content">
      <p>Hi {{userName}},</p>
      <p>Thank you for registering with <strong>{{brandName}}</strong>!  
         To complete your registration, please use the following One-Time Password (OTP):</p>

      <div class="otp-box">
        <div class="otp">{{otp}}</div>
        <div class="meta">
          This code will expire in <strong>{{expiresIn}}</strong>.<br>
          Expiry time: <strong>{{expiresAt}}</strong>
        </div>
      </div>

      <div class="btn-wrap">
        <a href="{{fLink}}" class="btn">Confirm Registration</a>
      </div>

      <p>If you didn’t create an account with us, you can safely ignore this email.</p>
      <p>For your security, do not share this code with anyone.</p>

      <p>Thanks,<br>{{userName}} Team</p>
    </div>
    <div class="footer">
      You received this email because a registration request was made for {{userEmail}}.<br>
      &copy; {{year}} {{userName}}. All rights reserved.
    </div>
  </div>
</body>
</html>
`
    .replace(/{{userName}}/g, userName)
    .replace(/{{userEmail}}/g, userEmail)
    .replace(/{{otp}}/g, otp)
    .replace(/{{expiresIn}}/g, expiresIn)

    .replace(/{{fLink}}/g, fLink);
};
// .replace(/{{brandName}}/g, "Oribi")
// .replace(/{{year}}/g, new Date().getFullYear()
//  .replace(/{{expiresAt}}/g, expiresAt)

// resend otp
exports.resendOtpTemplate = (userName, userEmail, otp, expiresIn, fLink) => {
  return `
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Resend otp for Registration</title>
  <style>
    body { margin:0; padding:0; background:#f5f7fb; font-family: Arial, Helvetica, sans-serif; }
    .container { max-width:560px; margin:40px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05); }
    .header { background:#0d6efd; color:#ffffff; padding:20px; text-align:center; font-size:20px; font-weight:bold; }
    .content { padding:24px; color:#1f2937; line-height:1.6; }
    .otp-box { text-align:center; margin:24px 0 8px; }
    .otp { display:inline-block; letter-spacing:6px; font-family:"Courier New", Courier, monospace; font-size:28px; font-weight:700; color:#0d6efd; padding:12px 16px; border:2px dashed #0d6efd; border-radius:8px; }
    .meta { text-align:center; font-size:12px; color:#6b7280; margin-top:8px; }
    .btn-wrap { text-align:center; margin:20px 0 8px; }
    .btn { display:inline-block; background:#0d6efd; color:#ffffff !important; text-decoration:none; padding:12px 18px; border-radius:8px; font-weight:600; font-size:14px; }
    .footer { text-align:center; font-size:12px; color:#6b7280; padding:16px; background:#f9fafb; }
    @media (max-width:600px) { .otp { font-size:24px; letter-spacing:4px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      {{userName}} - Confirm Your Registration
    </div>
    <div class="content">
      <p>Hi {{userName}},</p>
      <p>Thank you for registering with <strong>{{brandName}}</strong>!  
         To complete your registration, please use the following One-Time Password (OTP):</p>

      <div class="otp-box">
        <div class="otp">{{otp}}</div>
        <div class="meta">
          This code will expire in <strong>{{expiresIn}}</strong>.<br>
          Expiry time: <strong>{{expiresAt}}</strong>
        </div>
      </div>

      <div class="btn-wrap">
        <a href="{{fLink}}" class="btn">Confirm Registration</a>
      </div>

      <p>If you didn’t create an account with us, you can safely ignore this email.</p>
      <p>For your security, do not share this code with anyone.</p>

      <p>Thanks,<br>{{userName}} Team</p>
    </div>
    <div class="footer">
      You received this email because a registration request was made for {{userEmail}}.<br>
      &copy; {{year}} {{userName}}. All rights reserved.
    </div>
  </div>
</body>
</html>
`
    .replace(/{{userName}}/g, userName)
    .replace(/{{userEmail}}/g, userEmail)
    .replace(/{{otp}}/g, otp)
    .replace(/{{expiresIn}}/g, expiresIn)

    .replace(/{{fLink}}/g, fLink);
};

// reset password
exports.resetPasswordTemplate = (userName, userEmail, resetLink, expiresIn) => {
  return `
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Reset Your Password</title>
  <style>
    body { margin:0; padding:0; background:#f5f7fb; font-family: Arial, Helvetica, sans-serif; }
    .container { max-width:560px; margin:40px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05); }
    .header { background:#dc3545; color:#ffffff; padding:20px; text-align:center; font-size:20px; font-weight:bold; }
    .content { padding:24px; color:#1f2937; line-height:1.6; }
    .btn-wrap { text-align:center; margin:20px 0 8px; }
    .btn { display:inline-block; background:#dc3545; color:#ffffff !important; text-decoration:none; padding:12px 18px; border-radius:8px; font-weight:600; font-size:14px; }
    .meta { text-align:center; font-size:12px; color:#6b7280; margin-top:8px; }
    .footer { text-align:center; font-size:12px; color:#6b7280; padding:16px; background:#f9fafb; }
    @media (max-width:600px) { .btn { font-size:13px; padding:10px 16px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      {{userName}} - Password Reset Request
    </div>
    <div class="content">
      <p>Hi {{userName}},</p>
      <p>We received a request to reset your password for <strong>{{brandName}}</strong>.  
         To proceed, please click the button below:</p>

      <div class="btn-wrap">
        <a href="{{resetLink}}" class="btn">Reset Password</a>
      </div>

      <div class="meta">
        This link will expire in <strong>{{expiresIn}}</strong>.<br>
        Expiry time: <strong>{{expiresAt}}</strong>
      </div>

      <p>If you did not request this, you can safely ignore this email.</p>
      <p>Thanks,<br>{{brandName}} Team</p>
    </div>
    <div class="footer">
      You received this email because a password reset was requested for {{userEmail}}.<br>
      &copy; {{year}} {{brandName}}. All rights reserved.
    </div>
  </div>
</body>
</html>
`
    .replace(/{{userName}}/g, userName)
    .replace(/{{userEmail}}/g, userEmail)
    .replace(/{{resetLink}}/g, resetLink)
    .replace(/{{expiresIn}}/g, expiresIn);
  // .replace(/{{expiresAt}}/g, expiresAt)
  // .replace(/{{brandName}}/g, "YourAppName")
  // .replace(/{{year}}/g, new Date().getFullYear());
};

exports.OrderConfirmation = (cart, shippingInfo, finalAmount) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Oribi Order Summary</title>
  </head>
  <body
    style="margin:0; padding:0; background-color:#f3f4f6; font-family:'Segoe UI', Arial, sans-serif;"
  >
    <!-- Main Wrapper -->
    <table
      align="center"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      style="max-width:650px; margin:40px auto; background-color:#ffffff; border-radius:12px; box-shadow:0 4px 16px rgba(0,0,0,0.08); overflow:hidden;"
    >
      <!-- Header -->
      <tr>
        <td
          align="center"
          style="background:linear-gradient(135deg, #16a34a, #22c55e); color:#ffffff; padding:24px;"
        >
          <img
            src="https://your-domain.com/public/logo.png"
            alt="Oribi Logo"
            width="90"
            style="margin-bottom:10px;"
          />
          <h1 style="margin:0; font-size:22px; font-weight:600;">
            Your Order Has Been Confirmed!
          </h1>
          <p style="margin:6px 0 0; font-size:14px; opacity:0.9;">
            Thanks for shopping with <strong>Oribi</strong>.
          </p>
        </td>
      </tr>

      <!-- Greeting -->
      <tr>
        <td style="padding:28px 40px 0; color:#111827;">
          <p style="margin:0 0 12px; font-size:16px;">Hi <strong>${
            shippingInfo.fullName
          }</strong>,</p>
          <p style="margin:0 0 20px; font-size:15px; color:#4b5563;">
            We’ve received your order. Below is a summary of your purchase:
          </p>
        </td>
      </tr>

      <!-- Product Table -->
      <tr>
        <td style="padding:0 40px;">
          <table
            width="100%"
            cellpadding="10"
            cellspacing="0"
            style="border-collapse:collapse; background-color:#f9fafb; border-radius:8px; overflow:hidden;"
          >
            <thead>
              <tr style="background-color:#22c55e; color:#ffffff; text-align:left;">
                <th style="padding:12px;">Product</th>
                <th style="padding:12px;">Qty</th>
                <th style="padding:12px;">Price</th>
              </tr>
            </thead>
            <tbody>
               
            ${cart.items?.map(
              (item) =>
                `  <tr style="background-color:#22c55e; color:#ffffff; text-align:left;">
                <th style="padding:12px;">${
                  item.product ? item.product.name : item.variant.name
                }</th>
                <th style="padding:12px;">${item.quantity}</th>
                <th style="padding:12px;">${item.totalPrice}</th>
              </tr>`
            )}
            
            </tbody>
          </table>
        </td>
      </tr>

      <!-- Total Section -->
      <tr>
        <td style="padding:24px 40px 8px;">
          <p
            style="font-size:18px; font-weight:600; color:#111827; text-align:right; margin:0;"
          >
            Total: $${finalAmount}
          </p>
        </td>
      </tr>

      <!-- CTA -->
      <tr>
        <td align="center" style="padding:24px 0;">
          <a
            href="{{orderLink}}"
            style="display:inline-block; background-color:#22c55e; color:#ffffff; text-decoration:none; font-weight:600; padding:12px 24px; border-radius:6px; transition:all 0.3s ease;"
            >View Your Order</a
          >
        </td>
      </tr>

      <!-- Support Message -->
      <tr>
        <td style="padding:0 40px 24px; color:#6b7280; font-size:14px;">
          <p style="margin:0;">
            Need help? Contact us at
            <a href="mailto:support@oribi.com" style="color:#22c55e;">support@oribi.com</a>.
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td
          align="center"
          style="background-color:#f9fafb; padding:16px; font-size:13px; color:#9ca3af;"
        >
          © 2025 <strong>Oribi</strong> — All Rights Reserved.
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};

exports.orderConfirmationSms = (orderId, customerName, totalAmount) => {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Order Confirmation</title>
  </head>
  <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f6f7f9">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:32px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.06)">
      <tr>
        <td style="padding:18px 24px;border-bottom:1px solid #eee;">
          <h2 style="margin:0;font-size:16px;color:#111;">Order Confirmation</h2>
        </td>
      </tr>

      <tr>
        <td style="padding:18px 24px;color:#333;font-size:14px;line-height:1.45">
          <p style="margin:0 0 8px">Hi <strong>${customerName}</strong>,</p>
          <p style="margin:0 0 12px">Your order (ID: <strong>${orderId}</strong>) has been confirmed.</p>

          <p style="margin:0 0 6px">Total: <strong>${totalAmount}</strong></p>
          <p style="margin:0 0 12px">We’ll notify you when it’s shipped.</p>

          <p style="margin:18px 0 0;color:#666;font-size:13px">Thank you for shopping with Oribi.</p>
        </td>
      </tr>

      <tr>
        <td style="padding:12px 24px;background:#fafafa;color:#9aa0a6;font-size:12px;text-align:center">
          © 2025 Oribi
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};
