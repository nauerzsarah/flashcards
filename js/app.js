import { db, collection, getDocs, query, where } from "./firebase-config.js";

// Variáveis de controle do jogo
let flashcards = [];
let indiceAtual = 0;
let idiomaSelecionado = localStorage.getItem('idiomaSelecionado') || 'ingles';

// Mapeamento para exibir os nomes bonitos no título
const nomesIdiomas = {
    ingles: "Inglês",
    espanhol: "Espanhol",
    alemao: "Alemão",
    polones: "Polonês",
    russo: "Russo"
};

// Elementos do HTML que vamos atualizar
const elementoTitulo = document.getElementById('idioma-titulo');
const elementoFront = document.getElementById('card-front-text');
const elementoExample = document.getElementById('card-example-text');
const elementoBack = document.getElementById('card-back-text');
const elementoLevel = document.getElementById('card-level');
const elementoContador = document.getElementById('card-counter');
const elementoCard = document.getElementById('flashcard');

// Função para buscar os cartões no Firebase baseando-se no idioma
async function carregarFlashcards() {
    // Define o título da página
    elementoTitulo.innerText = nomesIdiomas[idiomaSelecionado] || idiomaSelecionado.toUpperCase();

    try {
        // Cria uma busca filtrando apenas pelo idioma selecionado
        const q = query(collection(db, "flashcards"), where("idioma", "==", idiomaSelecionado));
        const querySnapshot = await getDocs(q);
        
        flashcards = [];
        querySnapshot.forEach((doc) => {
            flashcards.push(doc.data());
        });

        if (flashcards.length === 0) {
            elementoFront.innerText = "Nenhum cartão encontrado.";
            elementoExample.innerText = "Adicione cartões para este idioma no painel do Firebase.";
            elementoContador.innerText = "0 / 0";
            return;
        }

        // Embaralha os cartões para não virem sempre na mesma ordem (Opcional)
        flashcards.sort(() => Math.random() - 0.5);

        indiceAtual = 0;
        mostrarCartao();

    } catch (erro) {
        console.error("Erro ao buscar dados do Firebase: ", erro);
        elementoFront.innerText = "Erro ao carregar.";
        elementoExample.innerText = "Verifique sua conexão ou as regras do Firebase.";
    }
}

// Função para desenhar as informações do cartão atual na tela
function mostrarCartao() {
    if (flashcards.length === 0) return;

    // Garante que o cartão volte para a posição da frente ao mudar de carta
    elementoCard.classList.remove('flipped');

    // Aguarda um pequeno tempo para o cartão desvirar antes de trocar o texto (efeito visual limpo)
    setTimeout(() => {
        const cartao = flashcards[indiceAtual];
        
        elementoFront.innerText = cartao.front;
        elementoExample.innerText = cartao.example || "Sem exemplo disponível.";
        elementoBack.innerText = cartao.back;
        elementoLevel.innerText = cartao.level || "Nível?";
        
        // Atualiza o contador (ex: 1 / 15)
        elementoContador.innerText = `${indiceAtual + 1} / ${flashcards.length}`;
    }, 200);
}

// Lógica dos Botões de Navegação
window.proximaCarta = function() {
    if (flashcards.length === 0) return;
    // Se chegar no fim, volta para o primeiro cartão (looping)
    indiceAtual = (indiceAtual + 1) % flashcards.length;
    mostrarCartao();
}

window.cartaAnterior = function() {
    if (flashcards.length === 0) return;
    // Se estiver no primeiro e voltar, vai para o último cartão
    indiceAtual = (indiceAtual - 1 + flashcards.length) % flashcards.length;
    mostrarCartao();
}

// Lógica de clicar para virar o cartão
window.virarCard = function() {
    elementoCard.classList.toggle('flipped');
}

// Executa a busca assim que a página carrega
carregarFlashcards();

window.falarTexto = function(event) {
    // impede que o card vire ao clicar no botão de áudio
    event.stopPropagation();

    const texto = document.getElementById('card-front-text').innerText;
    const msg = new SpeechSynthesisUtterance();
    msg.text = texto;

    // Mapeamento de códigos de voz para cada idioma
    const vozes = {
        'ingles': 'en-US',
        'espanhol': 'es-ES',
        'alemao': 'de-DE',
        'polones': 'pl-PL',
        'russo': 'ru-RU'
    };

    msg.lang = vozes[idiomaSelecionado] || 'en-US';
    msg.rate = 0.9; // Velocidade um pouco mais lenta para facilitar o aprendizado

    window.speechSynthesis.speak(msg);
};
window.falarExemplo = function(event) {
    event.stopPropagation();
    window.speechSynthesis.cancel();

    const texto = document.getElementById('card-example-text').innerText;
    const msg = new SpeechSynthesisUtterance(texto);

    const mapeamento = {
        'ingles': 'en-US',
        'espanhol': 'es-ES',
        'alemao': 'de-DE',
        'polones': 'pl-PL',
        'russo': 'ru-RU'
    };

    msg.lang = mapeamento[idiomaSelecionado] || 'en-US';
    msg.rate = 0.85; // Um pouquinho mais devagar para frases longas

    window.speechSynthesis.speak(msg);
};
