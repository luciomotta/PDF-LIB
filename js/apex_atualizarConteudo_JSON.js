// function para processar o JSON e atualizar o DOM
function atualizarConteudo(num_pag) {
    let json = document.getElementById('P'+num_pag+'_JSON_DATA');
    let pdfContent = document.getElementById('bodypdf');
    try {
        const jsonData = JSON.parse(json.textContent);
        // Verificar se tem dados no array "PAII"
        if (jsonData.paii && jsonData.paii.length > 0){
            evento = jsonData.paii[0]; // Assign evento to the global variable

            //limpar o conteudo do pdfContent
            pdfContent.innerHTML = '';

            //Adionar numero do PAII no canto direto da tela 
            let numPaii = document.createElement('div');
            numPaii.innerHTML = `<p style="text-align: right;">Referência: #${evento.numPaii}</p>`;
            pdfContent.appendChild(numPaii);

            // Adicionar Titulo do EVENTO
            let Titulo = document.createElement('div');
            Titulo.innerHTML = `<h2>${evento.desEv}</h2>`;
            pdfContent.appendChild(Titulo);

        
            // Adicionar data e hora de inicio e fim
            let dataHora = document.createElement('div');
            dataHora.innerHTML = `<h3><strong> previsão Data e Hora:</strong></h3><p><strong>Inicio:</strong> ${evento.dthPrevIni} - <strong>Fim:</strong> ${evento.dthPrevFim}</p>`;
            pdfContent.appendChild(dataHora); 
            // Adiconar Base legal
            let baseLegal = document.createElement('div');
            baseLegal.innerHTML = `<h3>Base Legal:</h3><p>${evento.bLegal}</p>`;                    
            pdfContent.appendChild(baseLegal);
            // Adicionar Objetivo Geral 
            let objGeral = document.createElement('div');
            objGeral.innerHTML = `<h3>Objetivo Geral:</h3><p>${evento.objGeral}</p>`;
            pdfContent.appendChild(objGeral);
            // Adicionar Cronograma
            let cronograma = document.createElement('div');
            cronograma.innerHTML = `<h3>Cronograma:</h3><p>${evento.cronograma}</p>`;
            pdfContent.appendChild(cronograma);
            // Adicionar Orientação Geral
            let orientacaoGeral = document.createElement('div');
            orientacaoGeral.innerHTML = `<h3>Orientação Geral:</h3><p>${evento.oGeral}</p>`;
            pdfContent.appendChild(orientacaoGeral);
            // Adicionar Locais
            let locais = document.createElement('div');
            locais.innerHTML = `<h3>Locais:</h3>
                                <table style="border-collapse: collapse;">
                                    <thead>
                                        <tr>
                                            <th>Tipo Local</th>
                                            <th>Área</th>
                                            <th>Divisão</th>
                                            <th>Local Complemento</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${evento.locais.map(local => `
                                            <tr>
                                                <td>${local.tipoLocal}</td>
                                                <td>${local.area}</td>
                                                <td>${local.divisao}</td>
                                                <td>${local.localComplemento}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>`;
            pdfContent.appendChild(locais);
            // Adicionar Grupos
            let grupos = document.createElement('div');
            grupos.innerHTML = `<h3 id="grupos:">Grupos</h3>
                                <ul>
                                    ${evento.grupos.map(grupo => `
                                        <li>${grupo.desGrupo}</li>
                                    `).join('')}
                                </ul>`;
            pdfContent.appendChild(grupos);
            // Adicionar Unidades
            let unidades = document.createElement('div');
            unidades.innerHTML = '<h3>Unidades:</h3>';
            evento.unidades.forEach(unidade => {
                let div = document.createElement('div');
                div.innerHTML = `<h4>${unidade.sglUnidade}</h4>
                                <p>${unidade.desAtividade}</p>
                                <p><strong>Data e Hora de Assinatura:</strong> ${unidade.dthAss}</p>`;
                unidades.appendChild(div);
            });
            pdfContent.appendChild(unidades);
        }
    } catch (error) {
        console.error("Error ao processar o JSON:" + error);
    }
}
