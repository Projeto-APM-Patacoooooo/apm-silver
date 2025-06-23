const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './silver-web-server/uploads/sumulas');
    },
    filename: (req, file, cb) => {
        const nomeArquivo = Date.now() + path.extname(file.originalname);
        cb(null, nomeArquivo);
        // Aqui não precisa salvar globalmente
    }
});

const upload = multer({ storage: storage });

function rotear(servidor, callbackVerificarMan, callbackIsAuth, connection) {

    servidor.post("/upload/sumula", callbackIsAuth, upload.single('sumula'), (req, res) => {
        const info = req.body;

        if (!info || !req.file) {
            return res.sendStatus(500);
        }

        const nomeArquivo = req.file.filename; // <- Nome real salvo pelo multer

        const query = `INSERT INTO sumulas (nome, mes, ano, instituicao) VALUES (?, ?, ?, ?)`;
        const valores = [nomeArquivo, info.mes, info.ano, info.instituicao];

        connection.query(query, valores, (err, results) => {
            if (err) {
                console.log("Erro ao cadastrar sumula no banco de dados: " + err);
                return res.send(err);
            }

            res.redirect("/dashboard/sumulas");
        });
    });

}

module.exports = {
    rotear
};
