// mock-server.js
import http from 'http';
import url from 'url';

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  res.setHeader('Content-Type', 'application/json');

  console.log(`Received ${method} request to ${pathname}`);

  // POST /triggerOTP
  if (pathname === '/triggerOTP' && method === 'POST') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: "success", otp: "1234" }));
    return;
  }

  // GET /getLoanAccounts
  if (pathname === '/getLoanAccounts' && method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: "success",
      loans: [
        {
          loan_id: "L-98721",
          type: "Home Loan",
          tenure: "15 Years",
          internal_audit_code: "SEC-9921",
          bank_branch_id: "YB-MUM-01",
          internal_rating: "A1",
          audit_date: "2024-06-01",
          processing_center: "MUMBAI-PC",
          created_by: "SYS01",
          last_updated_by: "SYS32",
          created_at: "2023-05-02T10:00:00Z",
          last_updated_at: "2024-01-12T09:00:00Z",
          currency: "INR",
          internal_segment: "RETAIL",
          portfolio_code: "HL-IND-01"
        },
        {
          loan_id: "L-56211",
          type: "Personal Loan",
          tenure: "5 Years",
          internal_audit_code: "SEC-4412",
          bank_branch_id: "YB-HYD-02",
          internal_rating: "B2",
          audit_date: "2024-01-15",
          processing_center: "HYDERABAD-PC",
          created_by: "SYS02",
          last_updated_by: "SYS21",
          created_at: "2022-11-08T08:15:00Z",
          last_updated_at: "2024-02-01T13:45:00Z",
          currency: "INR",
          internal_segment: "RETAIL",
          portfolio_code: "PL-IND-02"
        }
      ]
    }));
    return;
  }

  // GET /loanDetails
  if (pathname === '/loanDetails' && method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: "success",
      loanId: "L-98721",
      tenure: "15 Years",
      interest_rate: "8.25%",
      principal_pending: "₹35,40,000",
      interest_pending: "₹4,75,000",
      nominee: "Rohan Sharma"
    }));
    return;
  }

  // 404 for unknown paths
  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(3000, () => {
  console.log('Mock server running on http://localhost:3000');
  console.log('Available endpoints:');
  console.log('  POST http://localhost:3000/triggerOTP');
  console.log('  GET  http://localhost:3000/getLoanAccounts');
  console.log('  GET  http://localhost:3000/loanDetails');
});

