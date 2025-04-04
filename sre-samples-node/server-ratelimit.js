const express = require('express');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

const app = express();
const port = 8080;

// Middleware de rate limiting (Limite de 100 requisições por minuto)
const limiter = rateLimit({
    windowMs: 60 * 1000,  // 1 minuto
    max: 100,  // Limite de 100 requisições
    message: 'Você excedeu o limite de requisições. Tente novamente mais tarde.',
});

// Aplica o rate limiter para todas as rotas
app.use(limiter);

// Função simulando chamada externa
async function externalService() {
    return 'Resposta da chamada externa';
}

// Rota que faz a chamada simulada
app.get('/api/ratelimit', async (req, res) => {
    try {
        const result = await externalService();
        res.send(result);
    } catch (error) {
        res.status(500).send(`Erro: ${error.message}`);
    }
});

// Função para simular erro de Rate Limit
async function simulateRateLimitError() {
    console.log('Iniciando simulação de Rate Limit...');

    let successCount = 0;
    let errorCount = 0;

    for (let i = 1; i <= 105; i++) { // Faz 105 requisições (5 a mais que o limite)
        try {
            const response = await axios.get('http://localhost:8080/api/ratelimit');
            console.log(`Requisição ${i}: Sucesso - ${response.data}`);
            successCount++;
        } catch (error) {
            console.log(`Requisição ${i}: Erro - ${error.response?.data || error.message}`);
            errorCount++;
        }
    }

    console.log(`✅ Total de sucessos: ${successCount}`);
    console.log(`❌ Total de erros por Rate Limit: ${errorCount}`);
}

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    
    // Aguarda 3 segundos antes de simular o Rate Limit
    setTimeout(() => {
        simulateRateLimitError();
    }, 3000);
});
