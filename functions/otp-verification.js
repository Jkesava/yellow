// functions/otp-verification.js

export function verifyOtp({ otpServer, otpUser }) {
  const server = String(otpServer || "").trim();
  const user = String(otpUser || "").trim();
  const isValid = server !== "" && server === user;
  return { isValid };
}
