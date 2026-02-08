import readline from "readline";
import { retryWithBackoff } from "./functions/retry-exponential-backoff.js";
import { verifyOtp } from "./functions/otp-verification.js";
import { projectLoans } from "./functions/projection-transform.js";

const BEECEPTOR_BASE = "http://localhost:3000";



const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(q) {
  return new Promise(resolve => rl.question(q, ans => resolve(ans.trim())));
}

async function main() {
  console.log("Yellow Bank Agent – local CLI demo\n");

  const phone = await ask("Enter registered phone number: ");
  const dob = await ask("Enter Date of Birth (DD-MM-YYYY): ");

  const otpRes = await retryWithBackoff({
    url: `${BEECEPTOR_BASE}/triggerOTP`,
    method: "POST",
    body: { phone, dob },
    maxRetries: 3,
    baseDelayMs: 500
  });

  if (!otpRes.success) {
    console.error("Failed to generate OTP:", otpRes.error);
    rl.close();
    return;
  }

  const otpServer = otpRes.data.otp;
  console.log("(Testing) OTP from server =", otpServer);

  const otpUser = await ask("Enter 4-digit OTP: ");
  const { isValid } = verifyOtp({ otpServer, otpUser });

  if (!isValid) {
    console.log("Incorrect OTP. Exiting.");
    rl.close();
    return;
  }

  console.log("OTP verified successfully.\n");

  const loansRes = await retryWithBackoff({
    url: `${BEECEPTOR_BASE}/getLoanAccounts?phone=${encodeURIComponent(
      phone
    )}&dob=${encodeURIComponent(dob)}`,
    method: "GET",
    maxRetries: 3,
    baseDelayMs: 500
  });

  if (!loansRes.success) {
    console.error("Failed to fetch loan accounts:", loansRes.error);
    rl.close();
    return;
  }

  const projected = projectLoans(loansRes.data);
  console.log("Your loan accounts:");
  projected.loans.forEach((loan, i) => {
    console.log(`${i + 1}. ${loan.type} | Loan ID: ${loan.loanId} | Tenure: ${loan.tenure}`);
  });

  const idx = parseInt(await ask("\nSelect a loan (enter number): "), 10) - 1;
  const selected = projected.loans[idx];

  if (!selected) {
    console.log("Invalid selection. Exiting.");
    rl.close();
    return;
  }

  console.log(`\nYou selected Loan ID: ${selected.loanId}\n`);

  const detailsRes = await retryWithBackoff({
    url: `${BEECEPTOR_BASE}/loanDetails?loanId=${encodeURIComponent(selected.loanId)}`,
    method: "GET",
    maxRetries: 3,
    baseDelayMs: 500
  });

  if (!detailsRes.success) {
    console.error("Failed to fetch loan details:", detailsRes.error);
    rl.close();
    return;
  }

  const d = detailsRes.data;
  console.log("Loan details:");
  console.log("Loan ID:", d.loanId);
  console.log("Tenure:", d.tenure);
  console.log("Interest rate:", d.interest_rate);
  console.log("Principal pending:", d.principal_pending);
  console.log("Interest pending:", d.interest_pending);
  console.log("Nominee:", d.nominee);

  const rating = await ask("\nRate our chat (Good/Average/Bad): ");
  console.log(`Thanks for rating us: ${rating}`);

  rl.close();
}

main().catch(err => {
  console.error("Unexpected error:", err);
  rl.close();
});

