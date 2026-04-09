const form = document.getElementById("form");
const tabela = document.getElementById("tabela");

// pegar dados
function pegar() {
  return JSON.parse(localStorage.getItem("games")) || [];
}

// salvar dados
function salvar(lista) {
  localStorage.setItem("games", JSON.stringify(lista));
}

// mostrar na tabela
function mostrar() {
  const lista = pegar();
  tabela.innerHTML = "";

  lista.forEach((g, i) => {
    tabela.innerHTML += `
      <tr>
        <td>${g.id}</td>
        <td>${g.nome}</td>
        <td>${g.preco}</td>
        <td>${g.loja}</td>
        <td><img src="${g.img}"></td>
        <td><button onclick="deletar(${i})">X</button></td>
      </tr>
    `;
  });
}

// deletar item
function deletar(i) {
  const lista = pegar();
  lista.splice(i, 1);
  salvar(lista);
  mostrar();
}

// buscar na API
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;

  if (nome.trim() === "") {
    alert("Digite um nome!");
    return;
  }

  const res = await fetch(`https://www.cheapshark.com/api/1.0/games?title=${nome}`);
  const dados = await res.json();

  const lista = pegar();

  dados.slice(0, 5).forEach(g => {
    lista.push({
      id: g.gameID,
      nome: g.external,
      preco: g.cheapest,
      loja: "CheapShark",
      img: g.steamAppID
        ? `https://cdn.akamai.steamstatic.com/steam/apps/${g.steamAppID}/capsule_sm_120.jpg`
        : "https://via.placeholder.com/120"
    });
  });

  salvar(lista);
  mostrar();
});

// carregar ao abrir
mostrar();
