// Generates an HTML template for sending a verification OTP email
export function generateVerificationOtpEmailTemplate(otpCode) {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
        <!-- Header with background color -->
        <h2 style="color: #fff; background-color: #4CAF50; padding: 10px; text-align: center;">
            Verify Your Email Address
        </h2>

        <!-- Greeting -->
        <p style="font-size: 16px; color: #333;">Dear User,</p>
        <p style="font-size: 16px; color: #333;">
            To complete your registration or login, please use the following verification code:
        </p>

        <!-- OTP Code display -->
        <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #000; padding: 10px 20px; border: 2px dashed #4CAF50;">
                ${otpCode}
            </span>
        </div>

        <!-- Validity and instructions -->
        <p style="font-size: 16px; color: #555;">
            This code is valid for <strong>15 minutes</strong>. Please do not share this code with anyone.
        </p>

        <p style="font-size: 16px; color: #555;">
            If you did not request this email, please ignore it.
        </p>

        <!-- Footer -->
        <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #666;">
            <p>Thank you,<br><strong>Bookworm Team</strong></p>
            <p style="font-size: 12px; color: #444;">
                This is an automated message. Please do not reply to this email.
            </p>
        </footer>
    </div>
    `;
}

// Generates an HTML template for sending a forgot password email
export function generateForgotPasswordEmailTemplate(resetPasswordUrl) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #000; color: #fff;">
      <!-- Header -->
      <h2 style="color: #fff; text-align: center;">Reset Your Password</h2>

      <!-- Greeting and instructions -->
      <p style="font-size: 16px; color: #ccc;">Dear User,</p>
      <p style="font-size: 16px; color: #ccc;">You requested to reset your password. Please click the button below to proceed:</p>

      <!-- Reset Password Button -->
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetPasswordUrl}"
           style="display: inline-block; font-size: 16px; font-weight: bold; color: #000; text-decoration: none; padding: 12px 20px; border: 1px solid #fff; border-radius: 5px; background-color: #fff;">
          Reset Password
        </a>
      </div>

      <!-- Expiration and fallback URL -->
      <p style="font-size: 16px; color: #ccc;">If you did not request this, please ignore this email. The link will expire in 10 minutes.</p>
      <p style="font-size: 16px; color: #ccc;">If the button above doesn’t work, copy and paste the following URL into your browser:</p>
      <p style="font-size: 16px; color: #fff; word-wrap: break-word;">${resetPasswordUrl}</p>

      <!-- Footer -->
      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #666;">
        <p>Thank you, <br>BookWorm Team</p>
        <p style="font-size: 12px; color: #444;">This is an automated message. Please do not reply to this email.</p>
      </footer>
    </div>
  `;
}
