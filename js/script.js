/*
 * Au Q Mia - Fase 2
 * JavaScript usado para tornar o site dinâmico.
 * Não há backend nesta fase: o formulário é validado no navegador
 * e o resumo do agendamento é exibido ao usuário.
 */

document.addEventListener("DOMContentLoaded", () => {
  atualizarRelogio();
  setInterval(atualizarRelogio, 1000);

  configurarFormulario();
  configurarFiltroProdutos();
  configurarDataAgendamento();
});

/** Exibe data e hora atuais em um elemento do rodapé/cabeçalho. */
function atualizarRelogio() {
  const elemento = document.getElementById("data-hora-atual");
  if (!elemento) return;

  const agora = new Date();
  elemento.textContent = agora.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium"
  });
}

/** Impede o usuário de escolher uma data anterior ao dia atual. */
function configurarDataAgendamento() {
  const campoData = document.getElementById("data-agendamento");
  if (!campoData) return;

  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  campoData.min = `${ano}-${mes}-${dia}`;
}

/** Filtra os produtos pelo nome, descrição ou categoria digitada. */
function configurarFiltroProdutos() {
  const campoBusca = document.getElementById("busca-produto");
  const cards = document.querySelectorAll("[data-product-card]");
  const contador = document.getElementById("contador-produtos");

  if (!campoBusca || !cards.length) return;

  campoBusca.addEventListener("input", () => {
    const termo = campoBusca.value.trim().toLowerCase();
    let visiveis = 0;

    cards.forEach((card) => {
      const texto = card.textContent.toLowerCase();
      const mostrar = texto.includes(termo);
      card.closest(".product-col").classList.toggle("d-none", !mostrar);
      if (mostrar) visiveis++;
    });

    if (contador) {
      contador.textContent = `${visiveis} produto(s) encontrado(s).`;
    }
  });
}

/** Valida o cadastro/agendamento e mostra um resumo na tela. */
function configurarFormulario() {
  const formulario = document.getElementById("cadastro-form");
  if (!formulario) return;

  formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!formulario.checkValidity()) {
      event.stopPropagation();
      formulario.classList.add("was-validated");
      return;
    }

    const dados = new FormData(formulario);
    const nomeCliente = dados.get("nome");
    const nomePet = dados.get("pet-nome");
    const servico = dados.get("servico");
    const modalidade = dados.get("modalidade");
    const data = dados.get("data-agendamento");
    const hora = dados.get("hora-agendamento");

    const [ano, mes, dia] = data.split("-");
    const dataFormatada = `${dia}/${mes}/${ano}`;

    const feedback = document.getElementById("form-feedback");
    feedback.className = "alert alert-success mt-4";
    feedback.setAttribute("role", "alert");
    feedback.innerHTML = `
      <h2 class="h5">Agendamento preparado com sucesso!</h2>
      <p class="mb-1"><strong>Cliente:</strong> ${escaparHtml(nomeCliente)}</p>
      <p class="mb-1"><strong>Pet:</strong> ${escaparHtml(nomePet)}</p>
      <p class="mb-1"><strong>Serviço:</strong> ${escaparHtml(servico)}</p>
      <p class="mb-1"><strong>Modalidade:</strong> ${escaparHtml(modalidade)}</p>
      <p class="mb-0"><strong>Data e horário:</strong> ${dataFormatada} às ${escaparHtml(hora)}</p>
    `;

    feedback.focus();
  });
}

/** Escapa texto antes de inseri-lo no HTML gerado pelo JavaScript. */
function escaparHtml(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
