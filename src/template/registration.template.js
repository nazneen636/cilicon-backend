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
