const campoBusca = document.getElementById("campoBusca");
const cards = document.querySelectorAll(".card-anime");
const mensagemBusca = document.getElementById("mensagemBusca");
const semResultado = document.getElementById("semResultado");
const botaoLimpar = document.getElementById("botaoLimpar");
const botaoTema = document.getElementById("botaoTema");

campoBusca.addEventListener("input", function () {
    const texto = campoBusca.value.toLowerCase().trim();
    let encontrados = 0;
    cards.forEach(function (card) {
        const titulo = card.querySelector("h3").textContent.toLowerCase();
        const corresponde = titulo.includes(texto);
        card.style.display = corresponde ? "block" : "none";
        if (corresponde) {
            encontrados++;
        }
    });

    if (texto === "") {
        mensagemBusca.textContent = "Digite um anime para filtrar os cards.";
    } else {
        mensagemBusca.textContent = encontrados + " anime(s) encontrado(s).";
    }
    semResultado.style.display = encontrados === 0 ? "block" : "none";
});

botaoLimpar.addEventListener("click", function () {
    campoBusca.value = "";
    cards.forEach(function (card) {
        card.style.display = "block";
    });
    mensagemBusca.textContent = "Digite um anime para filtrar os cards.";
    semResultado.style.display = "none";
});

const botoesDetalhes = document.querySelectorAll(".botao-detalhes");
botoesDetalhes.forEach(function (botao) {

    botao.addEventListener("click", function () {
        const card = botao.closest(".card-anime");
        card.classList.toggle("card-destaque");
        const estaDestacado = card.classList.contains("card-destaque");
        botao.textContent = estaDestacado ? "Remover destaque" : "Mostrar destaque";
    });
});

botaoTema.addEventListener("click", function () {
    document.body.classList.toggle("modo-neon");
    const modoAtivo = document.body.classList.contains("modo-neon");
    botaoTema.textContent = modoAtivo ? "Voltar ao tema normal" : "Ativar modo neon";
});
