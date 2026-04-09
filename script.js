const form = document.getElementById("form");
const tabela = document.getElementById("tabela");

function pegar() {
  return JSON.parse(localStorage.getItem("games")) || [];
}

function salvar(lista) {
  localStorage.setItem("games", JSON.stringify(lista));
}

function mostrar() {
  const lista = pegar();
  tabela.innerHTML = "";

  lista.forEach((g, i) => {
    tabela.innerHTML += `
      <tr>
        <td>${g.id}</td>
        <td>${g.nome}</td>
        <td>${g.preco}</td>
        <td><img src="${g.img}"></td>
        <td><button onclick="del(${i})">X</button></td>
      </tr>
    `;
  });
}

function del(i) {
  const lista = pegar();
  lista.splice(i, 1);
  salvar(lista);
  mostrar();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("input").value;

  if (!nome) {
    alert("digita algo");
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
      img: g.steamAppID
        ? `https://cdn.akamai.steamstatic.com/steam/apps/${g.steamAppID}/capsule_sm_120.jpg`
        : "https://via.placeholder.com/120"
    });
  });

  salvar(lista);
  mostrar();
});

mostrar();
