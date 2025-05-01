//Script que controla o avanço e retrocesso do carrosel

const imagemCarrosel = document.getElementById("carro_img");

let estagio = 1;
let maxEstagio = 3;
let intervaloAutomatico = 5000; //Ms

let relogio = 200;

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

function atualizar(){

    if(relogio >= 1){
        relogio -= 1;
    } else {
        relogio = 200;

        switch(estagio){
            case maxEstagio:
                estagio = 1;
            break;
    
            default:
                estagio += 1;
            break;
        };    
        atualizarImagem();
    }
    
    window.requestAnimationFrame(atualizar);
}

atualizar();

function avancar(){
    switch(estagio){
        case maxEstagio:
            estagio = 1;
        break;

        default:
            estagio += 1;
        break;
    };

    relogio += 50;
    
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

    relogio += 50;

    atualizarImagem();
};