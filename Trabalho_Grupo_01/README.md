# Catálogo Interativo de Produtos

**Disciplina:** Programação Web — Trabalho em Grupo 1
**Integrantes:** (preencher com os nomes do grupo)

Aplicação web feita apenas com HTML, CSS e JavaScript (sem frameworks), que consome a
[DummyJSON Products API](https://dummyjson.com/docs/products).

## Funcionalidades
- Listagem de produtos com nome, imagem e preço
- Pesquisa por nome (`/products/search?q=`)
- Detalhes do produto (`/products/{id}`) em uma janela modal
- Favoritos: adicionar e remover
- Persistência dos favoritos no `localStorage` (mantidos após recarregar)
- Mensagem de carregamento e aviso de erro quando a API falha
- Layout responsivo

## Como executar
1. Baixe ou clone o repositório.
2. Abra o arquivo `index.html` no navegador (é necessário acesso à internet).

## Estrutura
- `index.html` — estrutura da página
- `style.css` — estilos
- `app.js` — lógica (fetch, DOM, eventos, localStorage)
