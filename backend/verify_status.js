const http = require('http');

http.get('http://localhost:5001/api/assignments', (res) => {
  console.log('Backend assignments status:', res.statusCode);
}).on('error', (e) => {
  console.error('Backend error:', e.message);
});

http.get('http://localhost:5177/', (res) => {
  console.log('Frontend status:', res.statusCode);
}).on('error', (e) => {
  console.error('Frontend error (5177):', e.message);
});

http.get('http://localhost:5173/', (res) => {
  console.log('Frontend status:', res.statusCode);
}).on('error', (e) => {
  console.error('Frontend error (5173):', e.message);
});
