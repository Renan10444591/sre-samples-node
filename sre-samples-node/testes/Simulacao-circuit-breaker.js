const axios = require('axios');

async function runTest() {
    const results = [];

    for (let i = 0; i < 40; i++) {
        try {
            const res = await axios.get('http://localhost:8080/api/circuitbreaker');
            console.log(`✔️ Requisição ${i + 1}:`, res.data);
            results.push('success');
        } catch (err) {
            console.log(`❌ Requisição ${i + 1}:`, err.response ? err.response.data : err.message);
            results.push('fail');
        }

        // Pequeno delay entre as requisições
        await new Promise(r => setTimeout(r, 500));
    }

    const successCount = results.filter(r => r === 'success').length;
    const failCount = results.length - successCount;
    console.log(`\nResumo: ${successCount} sucesso(s), ${failCount} falha(s)`);
}

runTest();
