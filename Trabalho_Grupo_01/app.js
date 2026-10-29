const API = "https://dummyjson.com/products";
const CHAVE_FAVORITOS = "favoritos";

const lista = document.getElementById("lista");
const statusEl = document.getElementById("status");
const formBusca = document.getElementById("form-busca");
const campoBusca = document.getElementById("busca");
const abaTodos = document.getElementById("aba-todos");
const abaFavoritos = document.getElementById("aba-favoritos");
const contador = document.getElementById("contador");
const dialogo = document.getElementById("detalhes");
const conteudoDetalhes = document.getElementById("det-conteudo");

let produtos = [];
let favoritos = carregarFavoritos();
let modo = "todos";

function carregarFavoritos() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_FAVORITOS));
    return Array.isArray(dados) ? dados : [];
  } catch (erro) {
    return [];
  }
}

function salvarFavoritos() {
  localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(favoritos));
  contador.textContent = favoritos.length;
}

function ehFavorito(id) {
  return favoritos.some((fav) => fav.id === id);
}

function alternarFavorito(produto) {
  if (ehFavorito(produto.id)) {
    favoritos = favoritos.filter((fav) => fav.id !== produto.id);
  } else {
    favoritos.push({
      id: produto.id,
      title: produto.title,
      price: produto.price,
      thumbnail: produto.thumbnail,
    });
  }
  salvarFavoritos();
  renderizar();
}

async function buscarProdutos(termo = "") {
  const url = termo
    ? `${API}/search?q=${encodeURIComponent(termo)}&limit=30`
    : `${API}?limit=30`;

  mostrarStatus("Carregando produtos...");
  lista.innerHTML = "";
  try {
    const resposta = await fetch(url);
    if (!resposta.ok) {
      throw new Error(`Erro HTTP ${resposta.status}`);
    }
    const dados = await resposta.json();
    produtos = dados.products;
    mostrarStatus(produtos.length === 0 ? `Nenhum produto encontrado para "${termo}".` : "");
    renderizar();
  } catch (erro) {
    produtos = [];
    mostrarStatus(
      "Não foi possível carregar os produtos. Verifique sua conexão ou tente novamente mais tarde.",
      true
    );
    console.error(erro);
  }
}

async function buscarDetalhes(id) {
  try {
    const resposta = await fetch(`${API}/${id}`);
    if (!resposta.ok) {
      throw new Error(`Erro HTTP ${resposta.status}`);
    }
    return await resposta.json();
  } catch (erro) {
    console.error(erro);
    return null;
  }
}

function mostrarStatus(mensagem, erro = false) {
  statusEl.textContent = mensagem;
  statusEl.classList.toggle("erro", erro);
}

function formatarPreco(valor) {
  return valor.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function criarCartao(produto) {
  const cartao = document.createElement("article");
  cartao.className = "cartao";

  const img = document.createElement("img");
  img.src = produto.thumbnail;
  img.alt = produto.title;
  img.loading = "lazy";

  const corpo = document.createElement("div");
  corpo.className = "corpo";

  const titulo = document.createElement("h2");
  titulo.textContent = produto.title;

  const preco = document.createElement("p");
  preco.className = "preco";
  preco.textContent = formatarPreco(produto.price);

  const acoes = document.createElement("div");
  acoes.className = "acoes";

  const btnDetalhes = document.createElement("button");
  btnDetalhes.type = "button";
  btnDetalhes.textContent = "Ver detalhes";
  btnDetalhes.addEventListener("click", () => abrirDetalhes(produto.id));

  const btnFav = document.createElement("button");
  btnFav.type = "button";
  const favorito = ehFavorito(produto.id);
  btnFav.className = "btn-fav" + (favorito ? " ativo" : "");
  btnFav.textContent = favorito ? "Remover" : "Favoritar";
  btnFav.setAttribute("aria-pressed", favorito);
  btnFav.addEventListener("click", () => alternarFavorito(produto));

  acoes.append(btnDetalhes, btnFav);
  corpo.append(titulo, preco, acoes);
  cartao.append(img, corpo);
  return cartao;
}

function renderizar() {
  lista.innerHTML = "";
  const itens = modo === "favoritos" ? favoritos : produtos;

  if (modo === "favoritos") {
    mostrarStatus(itens.length === 0 ? "Você ainda não favoritou nenhum produto." : "");
  }
  for (const produto of itens) {
    lista.appendChild(criarCartao(produto));
  }
}

async function abrirDetalhes(id) {
  conteudoDetalhes.innerHTML = "<p>Carregando detalhes...</p>";
  dialogo.showModal();

  const p = await buscarDetalhes(id);
  if (!p) {
    conteudoDetalhes.innerHTML = "<p>Não foi possível carregar os detalhes deste produto.</p>";
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "det";

  const img = document.createElement("img");
  img.src = p.thumbnail;
  img.alt = p.title;

  const info = document.createElement("div");
  const titulo = document.createElement("h2");
  titulo.id = "det-titulo";
  titulo.textContent = p.title;

  const descricao = document.createElement("p");
  descricao.textContent = p.description;

  const dl = document.createElement("dl");
  const campos = [
    ["Preço", formatarPreco(p.price)],
    ["Categoria", p.category],
    ["Marca", p.brand || "Não informada"],
    ["Avaliação", `${p.rating} / 5`],
    ["Estoque", `${p.stock} unidades`],
  ];
  for (const [rotulo, valor] of campos) {
    const dt = document.createElement("dt");
    dt.textContent = rotulo;
    const dd = document.createElement("dd");
    dd.textContent = valor;
    dl.append(dt, dd);
  }

  info.append(titulo, descricao, dl);
  wrapper.append(img, info);
  conteudoDetalhes.innerHTML = "";
  conteudoDetalhes.appendChild(wrapper);
}

function trocarModo(novoModo) {
  modo = novoModo;
  abaTodos.classList.toggle("ativa", modo === "todos");
  abaFavoritos.classList.toggle("ativa", modo === "favoritos");
  if (modo === "todos") {
    mostrarStatus(produtos.length === 0 ? "Nenhum produto carregado." : "");
  }
  renderizar();
}

formBusca.addEventListener("submit", (evento) => {
  evento.preventDefault();
  trocarModo("todos");
  buscarProdutos(campoBusca.value.trim());
});

abaTodos.addEventListener("click", () => trocarModo("todos"));
abaFavoritos.addEventListener("click", () => trocarModo("favoritos"));
document.getElementById("fechar").addEventListener("click", () => dialogo.close());
dialogo.addEventListener("click", (evento) => {
  if (evento.target === dialogo) dialogo.close();
});


contador.textContent = favoritos.length;
buscarProdutos();
