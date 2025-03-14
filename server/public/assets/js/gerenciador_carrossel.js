//Script que controla o avanço e retrocesso do carrosel

const imagemCarrosel = document.getElementById("carro_img");

let estagio = 1;
let maxEstagio = 3;
let intervaloAutomatico = 5000; //Ms

function atualizarImagem(){
    switch (estagio) {
        case 1:
            imagemCarrosel.src = 'assets/img/ermelinda_01.jpeg';
        break;
        case 2:
            imagemCarrosel.src = 'assets/img/ermelinda_02.jpg';
        break;
        case 3:
            imagemCarrosel.src = 'assets/img/ermelinda_03.jpg';
        break;
    }
};

function avancar(){
    switch(estagio){
        case maxEstagio:
            estagio = 1;
        break;

        default:
            estagio += 1;
        break;
    };
    
    atualizarImagem();
};

function retroceder(){
    switch(estagio){
        case 1:
            estagio = 3;
        break;

        default:
            estagio -= 1;
        break;
    };

    atualizarImagem();
};

function avancoAutomatico(){
    avancar()
    setTimeout(avancoAutomatico, intervaloAutomatico);
};

avancoAutomatico();