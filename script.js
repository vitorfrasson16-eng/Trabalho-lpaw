const formulario = document.querySelector("#form-tarefa");
const entrada = document.querySelector("#entrada-tarefa");
const lista = document.querySelector("#lista-tarefas");
const contador = document.querySelector("#contador");
const listaVazia = document.querySelector("#lista-vazia");
const mensagem = document.querySelector("#mensagem");
const botoesFiltro = document.querySelectorAll(".filtro");
const botaoLimpar = document.querySelector("#limpar-concluidas");

let tarefas = JSON.parse(localStorage.getItem("minhas-tarefas")) || [];
let filtroAtual = "todas";

function salvarTarefas() {
  localStorage.setItem("minhas-tarefas", JSON.stringify(tarefas));
}

function atualizarContador() {
  const pendentes = tarefas.filter(tarefa => !tarefa.concluida).length;
  contador.textContent = `${tarefas.length} ${tarefas.length === 1 ? "tarefa" : "tarefas"} • ${pendentes} pendente(s)`;
}

function mostrarTarefas() {
  lista.innerHTML = "";

  const tarefasFiltradas = tarefas.filter(tarefa => {
    if (filtroAtual === "pendentes") return !tarefa.concluida;
    if (filtroAtual === "concluidas") return tarefa.concluida;
    return true;
  });

  tarefasFiltradas.forEach(tarefa => {
    const item = document.createElement("li");
    item.className = `item-tarefa${tarefa.concluida ? " concluida" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarefa.concluida;
    checkbox.setAttribute("aria-label", `Marcar ${tarefa.texto} como concluída`);
    checkbox.addEventListener("change", () => {
      tarefa.concluida = checkbox.checked;
      salvarTarefas();
      mostrarTarefas();
    });

    const texto = document.createElement("span");
    texto.className = "texto-tarefa";
    texto.textContent = tarefa.texto;

    const remover = document.createElement("button");
    remover.type = "button";
    remover.className = "botao-remover";
    remover.textContent = "Remover";
    remover.setAttribute("aria-label", `Remover tarefa ${tarefa.texto}`);
    remover.addEventListener("click", () => {
      tarefas = tarefas.filter(itemTarefa => itemTarefa.id !== tarefa.id);
      salvarTarefas();
      mostrarTarefas();
    });

    item.append(checkbox, texto, remover);
    lista.appendChild(item);
  });

  listaVazia.hidden = tarefasFiltradas.length > 0;
  atualizarContador();
}

formulario.addEventListener("submit", evento => {
  evento.preventDefault();
  const texto = entrada.value.trim();

  if (!texto) {
    mensagem.textContent = "Digite uma tarefa antes de adicionar.";
    entrada.focus();
    return;
  }

  tarefas.push({
    id: Date.now(),
    texto,
    concluida: false
  });

  salvarTarefas();
  filtroAtual = "todas";
  atualizarBotoesFiltro();
  mostrarTarefas();
  formulario.reset();
  mensagem.textContent = "Tarefa adicionada com sucesso!";
  entrada.focus();
});

function atualizarBotoesFiltro() {
  botoesFiltro.forEach(botao => {
    const selecionado = botao.dataset.filtro === filtroAtual;
    botao.classList.toggle("ativo", selecionado);
    botao.setAttribute("aria-pressed", String(selecionado));
  });
}

botoesFiltro.forEach(botao => {
  botao.addEventListener("click", () => {
    filtroAtual = botao.dataset.filtro;
    atualizarBotoesFiltro();
    mostrarTarefas();
  });
});

botaoLimpar.addEventListener("click", () => {
  tarefas = tarefas.filter(tarefa => !tarefa.concluida);
  salvarTarefas();
  mostrarTarefas();
  mensagem.textContent = "Tarefas concluídas removidas.";
});

mostrarTarefas();
