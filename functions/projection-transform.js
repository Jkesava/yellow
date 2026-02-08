// functions/projection-transform.js

export function projectLoans(getLoanAccountsResponse) {
  const raw = getLoanAccountsResponse || {};
  const loans = Array.isArray(raw.loans) ? raw.loans : [];

  const projected = loans.map(loan => ({
    loanId: loan.loan_id,
    type: loan.type,
    tenure: loan.tenure
  }));

  return { loans: projected };
}
