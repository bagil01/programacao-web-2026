const formAnime = document.getElementById("formAnime");
const titulo = document.getElementById("titulo");
const genero = document.getElementById("genero");
const ano = document.getElementById("ano");
const descricao = document.getElementById("descricao");
const listaAnimes = document.getElementById("listaAnimes");
const mensagemVazia = document.getElementById("mensagemVazia");
const contador = document.getElementById("contador");
const limparRegistros = document.getElementById("limparRegistros");

let registros = [];

const dadosSalvos = localStorage.getItem("animes");

if (dadosSalvos) {
registros = JSON.parse(dadosSalvos);
}

function salvarRegistros() {
localStorage.setItem("animes", JSON.stringify(registros));
}

function mostrarRegistros() {
listaAnimes.innerHTML = "";

let quantidade = 0;

for (const anime of registros) {
const card = document.createElement("article");
const tituloAnime = document.createElement("h3");
const informacoes = document.createElement("div");
const generoAnime = document.createElement("span");
const anoAnime = document.createElement("span");
const texto = document.createElement("p");
const botaoExcluir = document.createElement("button");

card.className = "card";
informacoes.className = "info";

tituloAnime.textContent = anime.titulo;
generoAnime.textContent = anime.genero;
anoAnime.textContent = anime.ano;
texto.textContent = anime.descricao;
botaoExcluir.textContent = "Excluir";

botaoExcluir.addEventListener("click", function () {
registros = registros.filter(function (item) {
return item.id !== anime.id;
});

salvarRegistros();
mostrarRegistros();
});

informacoes.appendChild(generoAnime);
informacoes.appendChild(anoAnime);
card.appendChild(tituloAnime);
card.appendChild(informacoes);
card.appendChild(texto);
card.appendChild(botaoExcluir);
listaAnimes.appendChild(card);

quantidade++;
}

contador.textContent = quantidade + " anime(s) cadastrado(s)";
mensagemVazia.style.display = quantidade === 0 ? "block" : "none";
}

formAnime.addEventListener("submit", function (event) {
event.preventDefault();

const novoAnime = {
id: Date.now(),
titulo: titulo.value.trim(),
genero: genero.value.trim(),
ano: Number(ano.value),
descricao: descricao.value.trim()
};

registros.push(novoAnime);
salvarRegistros();
mostrarRegistros();
formAnime.reset();
titulo.focus();
});

limparRegistros.addEventListener("click", function () {
if (registros.length === 0) {
return;
}

registros = [];
localStorage.removeItem("animes");
mostrarRegistros();
});

mostrarRegistros();
