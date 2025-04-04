const axios = require('axios');

async function makeRequests() {
  const urls = Array(10).fill('http://localhost:8080/api/bulkhead');
  
  const start = Date.now();
  const responses = await Promise.allSettled(urls.map(url => axios.get(url)));
  const end = Date.now();

  responses.forEach((res, i) => {
    console.log(`Requisição ${i + 1}:`, res.status === 'fulfilled' ? res.value.data : res.reason.message);
  });

  console.log(`Tempo total: ${(end - start) / 1000}s`);
}

makeRequests();
