const crypto = require('crypto');

let chaves = []

function GerarNovaChave() {
    var novaChave = crypto.randomBytes(16).toString('hex')
    console.log("[Servidor]: Nova chave gerada: " + novaChave)
    chaves.push(novaChave.toString())
    return novaChave;
}

module.exports = { GerarNovaChave };