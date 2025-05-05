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
            case '\u0003':
                process.exit();
            break;
        }
    })
}

module.exports = {
    TeclasMagicas
}