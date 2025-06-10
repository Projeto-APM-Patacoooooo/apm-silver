function TeclasMagicas(callBackDeManutencao) {

    let manutencao = false;

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf-8');

    process.stdin.on('data', (key) => {
        switch (key) {
            case 'r':
                console.warn("[Servidor]: Reiniciando todos os processos...");
                break;
            case 'm':
                if (manutencao === false) {
                    console.warn("[Servidor]: Modo de manutenção ativado!");
                    manutencao = true;
                } else {
                    console.warn("[Servidor]: Modo de manutenção desativado!");
                    manutencao = false;
                };
                callBackDeManutencao(manutencao);
                break;
            case 'p':
                const memoryUsage = process.memoryUsage();

                // Convertendo para MB
                const rssMB = memoryUsage.rss / (1024 * 1024);
                const heapTotalMB = memoryUsage.heapTotal / (1024 * 1024);
                const heapUsedMB = memoryUsage.heapUsed / (1024 * 1024);
                const externalMB = memoryUsage.external / (1024 * 1024);
                
                console.log("========================================================")
                console.log("Informações de Performance:")
                console.log("========================================================")
                console.log(`RSS: ${rssMB.toFixed(2)} MB`);
                console.log(`Heap Total: ${heapTotalMB.toFixed(2)} MB`);
                console.log(`Heap Used: ${heapUsedMB.toFixed(2)} MB`);
                console.log(`External: ${externalMB.toFixed(2)} MB`);
                break;
            case '\u0003':
                process.exit();
                break;
        }
    })
}

module.exports = {
    TeclasMagicas
}