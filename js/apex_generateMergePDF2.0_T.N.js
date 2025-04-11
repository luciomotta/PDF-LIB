
// Garantir que a variável global seja um array
//window.ablobsUNIDADES = window.ablobsUNIDADES || [];
window.ablobPAII = [];
window.ablobsUNIDADES = [];

class processPDF {
    constructor() {
        // Inicializa as variáveis como vazias
        window.ablobPAII = [];
        window.ablobPAII = null;
        window.ablobsUNIDADES = [];
        this.geraHTMLInstance = new processPDF.GeraHTML();
    }

    async gerarPAII(num_pag) {
        // Mostra spinner com overlay
        const spinner = apex.widget.waitPopup();
    
        try {
            await this.geraHTMLInstance.geraHTML(num_pag);
            await this.generatePDF();
        } finally {
            // Remove o spinner, mesmo se der erro
            spinner.remove();
        }
    }
    
    async generatePDF() {
        //1º gero um blob do PAII -> salvo em array ablobPAII
        //2º gero um blob para cada anexo de PAII_UNIDADE -> salvo em ablobsUNIDADES
        //3º junto todos em um único array -> ablobCompleto
        //4º crio o pdf baseado neste array com todos os blobs
        const element = document.getElementById('P_PDF_CONTENT');
        const options = {
            margin: 10,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        };
        await html2pdf().from(element).set(options).output('blob').then(function (pdfBlob) {
            window.ablobPAII = pdfBlob;
            //var url = URL.createObjectURL(pdfBlob);
            //window.open(url, '_blank', "width=1500,height=1000");
        });

        // função que roda em cada anexo de paii_unidade, e gerar um blob para cada pdf jogando em um array
        // ao final terei um array de blobs, onde cada blob é um pdf anexo de paii_unidade
        await this.unirPDFsDasUnidades();

        await this.mergeBlobsGeraPDFCompleto();
    }



    // Função para buscar o PDF de acordo com o ANEXO_ID
    async fetchPdf(anexoId) {
        // Construir a URL dinâmica
        const fileUrl = $('#P70_URL_APEX').val(); // Verifique se o seletor está correto
        const anexo_id = `:APPLICATION_PROCESS=DOWN_ANEXO_PROCESS:::ANEXO_ID:${anexoId}`;
        const URLComp = fileUrl + anexo_id;

        try {
            const response = await fetch(URLComp);
            if (!response.ok) {
                throw new Error('Erro ao buscar o arquivo PDF');
            }
            const blob = await response.blob();

            // Adiciona o blob ao array global
            window.ablobsUNIDADES.push(blob);

            // Opcional: criar uma URL para o Blob e abrir em nova aba
            //const pdfUrl = URL.createObjectURL(blob);
            //window.open(pdfUrl, '_blank', 'width=1500,height=1000');

            console.log(`Blob para ANEXO_ID ${anexoId} armazenado com sucesso.`);
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    // Função para processar os anexos de forma sequencial
    async unirPDFsDasUnidades() {


        const v_input = document.getElementById('P70_AUX_ARRAY_ANEXO').value;
        if (v_input.trim() !== '') {
            const arrayAnnexos = v_input.split(',')
                .map(item => item.trim())
                .filter(item => item !== '');

            // Executa cada chamada de forma sequencial usando for...of
            for (const anexoId of arrayAnnexos) {
                //Function para trazer os anexos
                await this.fetchPdf(anexoId);
                console.log(`Processado o anexo: ${anexoId}`);
            }
            console.log('Todos os blobs foram armazenados:', window.ablobsUNIDADES);
        } else {
            console.error('Input vazio. Nenhum PDF será buscado.');
        }
    }

    // Função para mesclar os blobs em um único PDF
    async mergeBlobsGeraPDFCompleto() {
        const ablobCompleto = [];
    
        if (window.ablobPAII) {
            // Adicionar o PDF gerado ao array
            ablobCompleto.push(window.ablobPAII);
        }
        
        if (window.ablobsUNIDADES && window.ablobsUNIDADES.length > 0) {
            // Adicionar os PDFs vindos do banco de dados ao array  
            window.ablobsUNIDADES.forEach(blob => {  
                ablobCompleto.push(blob);
            });
        }
    
    
        const mergedPdf = await PDFLib.PDFDocument.create();
    
        // Iterar sobre os PDFs armazenados no array
        for (const pdfBlob of ablobCompleto) {
            // Carregar o documento PDF de cada BLOB
            const pdfDoc = await PDFLib.PDFDocument.load(await pdfBlob.arrayBuffer());
            
            // Obter todas as páginas do PDF
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    
            // Adicionar as páginas copiadas ao PDF combinado
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
    
        // Salvar o PDF combinado
        const mergedPdfBytes = await mergedPdf.save();
    
        // Criar um Blob com os bytes do PDF combinado
        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    
        // Criar uma URL para o Blob
        const url = URL.createObjectURL(blob);
    
        // Abrir o PDF combinado em uma nova aba
        window.open(url, '_blank', 'width=1500,height=1000');
    }

    

}

processPDF.GeraHTML = class {
    constructor() {
        this.contador = 1;
    }

    criarTitulo(texto) {
        let titulo = document.createElement("h3");
        titulo.innerHTML = `${this.contador}. ${texto}`;
        this.contador++;
        return titulo;
    }

    geraHTML(num_pag) {
        return new Promise((resolve, reject) => {
            //try {
                this.contador = 1;
                let json = document.getElementById("P" + num_pag + "_JSON_DATA");
                let pdfContent = document.getElementById("bodypdf");
                const jsonData = JSON.parse(json.value);

                if (jsonData.paii && jsonData.paii.length > 0) {
                    let evento = jsonData.paii[0];
                    pdfContent.innerHTML = "";

                    if (evento.numPaii != null) {
                        const ref = document.getElementById("referencia");
                        ref.innerHTML = evento.numPaii;
                    }

                    if (evento.desEv != null) {
                        let Titulo = document.createElement("div");
                        Titulo.innerHTML = `<h2>${evento.desEv}</h2>`;
                        pdfContent.appendChild(Titulo);
                    }

                    if (evento.dthPrevIni != null && evento.dthPrevFim != null) {
                        let titulo = this.criarTitulo("Previsão:");
                        pdfContent.appendChild(titulo);
                        let dataHora = document.createElement("div");
                        dataHora.innerHTML = `<p><strong>Inicio:</strong> ${evento.dthPrevIni} - <strong>Fim:</strong> ${evento.dthPrevFim}</p>`;
                        pdfContent.appendChild(dataHora);
                    }

                    if (evento.bLegal != null) {
                        let titulo = this.criarTitulo("Base Legal:");
                        pdfContent.appendChild(titulo);
                        let baseLegal = document.createElement("div");
                        baseLegal.innerHTML = `<p>${evento.bLegal}</p>`;
                        pdfContent.appendChild(baseLegal);
                    }

                    if (evento.objGeral != null) {
                        let titulo = this.criarTitulo("Objetivo Geral:");
                        pdfContent.appendChild(titulo);
                        let objGeral = document.createElement("div");
                        objGeral.innerHTML = `<p>${evento.objGeral}</p>`;
                        pdfContent.appendChild(objGeral);
                    }

                    if (evento.cronograma != null) {
                        let titulo = this.criarTitulo("Cronograma:");
                        pdfContent.appendChild(titulo);
                        let cronograma = document.createElement("div");
                        cronograma.innerHTML = `<p>${evento.cronograma}</p>`;
                        pdfContent.appendChild(cronograma);
                    }

                    if (evento.oGeral != null) {
                        let titulo = this.criarTitulo("Orientação Geral:");
                        pdfContent.appendChild(titulo);
                        let orientacaoGeral = document.createElement("div");
                        orientacaoGeral.innerHTML = `<p>${evento.oGeral}</p>`;
                        pdfContent.appendChild(orientacaoGeral);
                    }

                    if (evento.locais && evento.locais.length > 0) {
                        let titulo = this.criarTitulo("Locais:");
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
                                                <td>${local.localComplemento ?? ""}</td>
                                            </tr>
                                        `
                                        )
                                        .join("")}
                                </tbody>
                            </table>`;
                        pdfContent.appendChild(locais);
                    }

                    if (evento.grupos != null) {
                        let titulo = this.criarTitulo("Grupos:");
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

                    if (evento.unidades && evento.unidades.length > 0) {
                        let titulo = this.criarTitulo("Unidades:");
                        pdfContent.appendChild(titulo);
                        this.gerarUnidades(evento, pdfContent);
                    }
                }
                resolve();
           /* } catch (error) {
                console.error("Error ao processar o JSON:" + error);
                reject(error);
            } */
        });
    }

    gerarUnidades(evento, pdfContent) {
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
}

