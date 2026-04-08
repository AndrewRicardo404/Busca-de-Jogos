const form = document.getElementById("formBusca");
const tabela = document.getElementById("tabelaGames");

/**
 * Salva dados no localStorage
 * @param {Array} lista
 */
function salvarLocal(lista) {
  localStorage.setItem("games", JSON.stringify(lista));
}

/**
 * Carrega dados do localStorage
 * @returns {Array}
 */
function carregarLocal() {
  return JSON.parse(localStorage.getItem("games")) || [];
}

/**
 * Renderiza tabela
 * @param {Array} games
 */
function renderizarTabela(games) {
  tabela.innerHTML = "";

  games.forEach((game, index) => {
    const linha = `
      <tr>
        <td>${game.gameID}</td>
        <td>${game.steamID}</td>
        <td><img src="${game.imagem}" width="80"></td>
        <td>${game.nome}</td>
        <td>R$ ${game.preco}</td>
        <td>${game.oferta}</td>
        <td>${game.loja}</td>
        <td><button class="delete" onclick="excluir(${index})">X</button></td>
      </tr>
    `;
    tabela.innerHTML += linha;
  });
}

/**
 * Exclui item da lista
 * @param {number} index
 */
function excluir(index) {
  let lista = carregarLocal();
  lista.splice(index, 1);
  salvarLocal(lista);
  renderizarTabela(lista);
}

/**
 * Busca jogos na API
 * @param {string} nome
 */
async function buscarGame(nome) {
  const url = `https://www.cheapshark.com/api/1.0/games?title=${nome}`;

  const resposta = await fetch(url);
  const dados = await resposta.json();

  let lista = carregarLocal();

  dados.slice(0, 5).forEach(game => {

    const imagem = game.steamAppID
      ? `https://cdn.akamai.steamstatic.com/steam/apps/${game.steamAppID}/capsule_sm_120.jpg`
      : "https://via.placeholder.com/120";

    lista.push({
      nome: game.external,
      preco: game.cheapest,
      oferta: game.cheapestDealID ? "Sim" : "Não",
      gameID: game.gameID,
      steamID: game.steamAppID || "N/A",
      imagem: imagem,
      loja: "CheapShark"
    });
  });

  salvarLocal(lista);
  renderizarTabela(lista);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nomeGame").value;

  if (!nome.trim()) {
    alert("Digite um nome válido!");
    return;
  }

  buscarGame(nome);
});

renderizarTabela(carregarLocal());
