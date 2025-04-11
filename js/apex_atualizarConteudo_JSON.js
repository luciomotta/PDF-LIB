let contador = 1;
function criarTitulo(texto) {
  let titulo = document.createElement("h3");
  titulo.innerHTML = `${contador}. ${texto}`;
  contador++;
  return titulo;
}

// function para processar o JSON e atualizar o DOM
function atualizarConteudo(num_pag) {
    // resetar Contador
    contador = 1; 

  let json = document.getElementById("P" + num_pag + "_JSON_DATA");
  let pdfContent = document.getElementById("bodypdf");
  const jsonData = JSON.parse(json.value);



  try {
    // Verificar se tem dados no array "PAII"
    if (jsonData.paii && jsonData.paii.length > 0) {
      evento = jsonData.paii[0]; // Assign evento to the global variable

      //limpar o conteudo do pdfContent
      pdfContent.innerHTML = "";

      //Adionar numero do PAII no canto direto da tela
      if (evento.numPaii != null) {
        const ref = document.getElementById("referencia");
        ref.innerHTML = evento.numPaii;
      }
      // Adicionar Titulo do EVENTO
      if (evento.desEv != null) {
        let Titulo = document.createElement("div");
        Titulo.innerHTML = `<h2>${evento.desEv}</h2>`;
        pdfContent.appendChild(Titulo);
      }
      // Adicionar data e hora de inicio e fim
      if (evento.dthPrevIni != null && evento.dthPrevFim != null) {
        let titulo = criarTitulo("Previsão:");
        pdfContent.appendChild(titulo);

        let dataHora = document.createElement("div");
        dataHora.innerHTML = `<p><strong>Inicio:</strong> ${evento.dthPrevIni} - <strong>Fim:</strong> ${evento.dthPrevFim}</p>`;
        pdfContent.appendChild(dataHora);
      }
      // Adiconar Base legal
      if (evento.bLegal != null) {
        let titulo = criarTitulo("Base Legal:");
        pdfContent.appendChild(titulo);

        let baseLegal = document.createElement("div");
        baseLegal.innerHTML = `<p>${evento.bLegal}</p>`;
        pdfContent.appendChild(baseLegal);
      }
      // Adicionar Objetivo Geral
      if (evento.objGeral != null) {
        let titulo = criarTitulo("Objetivo Geral:");
        pdfContent.appendChild(titulo);
        let objGeral = document.createElement("div");
        objGeral.innerHTML = `<p>${evento.objGeral}</p>`;
        pdfContent.appendChild(objGeral);
      }
      // Adicionar Cronograma
      if (evento.cronograma != null) {
        let titulo = criarTitulo("Cronograma:");
        pdfContent.appendChild(titulo);
        let cronograma = document.createElement("div");
        cronograma.innerHTML = `<p>${evento.cronograma}</p>`;
        pdfContent.appendChild(cronograma);
      }
      // Adicionar Orientação Geral
      if (evento.oGeral != null) {
        let titulo = criarTitulo("Orientação Geral:");
        pdfContent.appendChild(titulo);
        let orientacaoGeral = document.createElement("div");
        orientacaoGeral.innerHTML = `<p>${evento.oGeral}</p>`;
        pdfContent.appendChild(orientacaoGeral);
      }
      // Adicionar Locais
      if (evento.locais && evento.locais.length > 0) {
        let titulo = criarTitulo("Locais:");
        pdfContent.appendChild(titulo);
        let locais = document.createElement("div");
        locais.innerHTML = `
                                    <table style="border-collapse: collapse;">
                                        <thead>
                                            <tr>
                                                <th>Motivo</th>
                                                <th>Área</th>
                                                <th>Divisão</th>
                                                <th>Complemento</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${evento.locais
                                              .map(
                                                (local) => `
                                                <tr>
                                                    <td>${local.tipoLocal}</td>
                                                    <td>${local.area}</td>
                                                    <td>${local.divisao}</td>
                                                    <td>${
                                                      local.localComplemento ??
                                                      ""
                                                    }</td>
                                                </tr>
                                            `
                                              )
                                              .join("")}
                                        </tbody>
                                    </table>`;
        pdfContent.appendChild(locais);
      }
      // Adicionar Grupos
      if (evento.grupos != null) {
        let titulo = criarTitulo("Grupos:");
        pdfContent.appendChild(titulo);
        let grupos = document.createElement("div");
        grupos.innerHTML = `<ul>
                                        ${evento.grupos
                                          .map(
                                            (grupo) => `
                                            <li>${grupo.desGrupo}</li>
                                        `
                                          )
                                          .join("")}
                                    </ul>`;
        pdfContent.appendChild(grupos);
      }
      // Adicionar Unidades
      if (evento.unidades && evento.unidades.length > 0) {
        let titulo = criarTitulo("Unidades:");
        pdfContent.appendChild(titulo);

        gerarUnidades(evento, pdfContent);
        pdfContent.appendChild(unidades);
      }

    }
  } catch (error) {
    console.error("Error ao processar o JSON:" + error);
  }
}

function gerarUnidades(evento, pdfContent) {
  let tableEl = document.createElement("table");
  tableEl.innerHTML += `<thead>
      <tr>
        <th>Unidade</th>
        <th>Atividadee</th>
      </tr>
    </thead><tbody>`;
  evento.unidades.forEach((unidade) => {
    let tr = document.createElement("tr");
    tr.innerHTML = `<tr>
      <td>${unidade.sglUnidade}</td>
      <td >${unidade.desAtividade} <p style="font-size: 0.7em; text-align: right;">Responsável: ${unidade.pessoaAss} em ${unidade.dthAss ?? ""}</p></td>`;
    tableEl.appendChild(tr);
  });
  tableEl.innerHTML += `</tbody>`;

  pdfContent.appendChild(tableEl);
}




