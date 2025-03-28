
function generatePDF (num_pagina) {
    // Adiciona o método toDataURL() ao objeto HTMLImageElement
    Object.defineProperty
    (
        HTMLImageElement.prototype, 'toDataURL',
        {
            enumerable: false, configurable: true, writable: false, value: function (m, q) {
                let c = document.createElement('canvas');
                c.width = this.naturalWidth; c.height = this.naturalHeight;
                c.getContext('2d').drawImage(this, 0, 0); return c.toDataURL(m, q);
            }
        }
    );


   var data = new Date();
   var dia = data.getDate();           // 1-31
   var mes = data.getMonth();          // 0-11 (zero=janeiro)
   var ano = data.getFullYear();       // 4 dígitos
   var hora = data.getHours();          // 0-23
   var min = (data.getMinutes() < 10 ? '0' : '') + data.getMinutes();       // 00-59
   var seg = (data.getSeconds()  < 10 ? '0' : '') + data.getSeconds();        // 00-59
   var str_data = dia + '/' + (mes + 1) + '/' + ano;
   var str_hora = hora + ':' + min + ':' + seg;
    
   var elementlogo = document.getElementById('P' + num_pagina + '_LOGO').toDataURL("image/jpeg");

    //var jsondata = $v('P' + num_pagina + '_JSON_DATA');
    var jsondata = document.getElementById('P' + num_pagina + '_JSON_DATA').innerHTML;
    var jsondataobject = JSON.parse(jsondata);

    //const array_NOM_UNIDADE = jsondataobject.map(item => item.NOM_UNIDADE + '/');
    const array_NOM_UNIDADE = jsondataobject.map((item, index) => {
        if (index < jsondataobject.length -1 ){
            //se não for o último item adiciona a barra
            return item.NOM_UNIDADE + '/';

        }else{
            //se for o último item não adiciona a barra
            return item.NOM_UNIDADE;
        }
    });
    // cirando um array com os valores do campo DES_ATIVIDADE do jsondataobject[ARRAY com vários JSON]
    const array_DES_ATIVIDADE = jsondataobject.map(item => item.DES_ATIVIDADE);
    // depois converte para HTML
    const html_array_DES_ATIVIDADE = htmlToPdfmake(array_DES_ATIVIDADE);

    const docDefinition = {
        pageSize: 'A4',
        pageOrientation: 'portrait',
        pageMargins: [30, 45], // Margens da página
        defaultStyle: { font: 'Roboto' },


        // 📌 CABEÇALHO (Header)
        header: {
            margin: [30, 20], // Margem do cabeçalho
            alignment: 'center', // Alinha o cabeçalho ao centro
            table: {
                //widths: [50, '*'], // Largura das colunas do cabeçalho
                body: [
                    [
                        { image: elementlogo, fit: [50, 50] }, // Logotipo
                        { 
                            text: 'SECRETARIA DE POLÍCIA DO SENADO FEDERAL\nServiço de Treinamento Policial', 
                            style: 'headerTitle', 
                        }
                    ]
                ]
            },
            layout: 'noBorders' // Remove as bordas da tabela
        },

        // 📌 CONTEÚDO (Body)
        content: [
            { text: 'Título do Documento', style: 'title' },

            {
                text: 'Aqui vai o corpo do seu documento. Você pode adicionar parágrafos, imagens, tabelas, etc.',
                style: 'bodyText'
            },

            {
                table: {
                    widths: ['*', 'auto', 100, '*'],
                    body:[
                            ['Coluna 1', 'Coluna 2', 'Coluna 3', 'Coluna 4'],
                            [' ', ' ', {text: 'Nome da unidade: ' + array_NOM_UNIDADE, style: 'bodyText'}, 'Dado 4']
                            [' ', ' ', {text: 'Nome da unidade: ' + array_NOM_UNIDADE, style: 'bodyText'}, 'Dado 4']
                        ]
                        },
                layout: 'lightHorizontalLines' // Define linhas horizontais leves
            },
            html_array_DES_ATIVIDADE, 
            

        ],


        // 📌 RODAPÉ (Footer)
        footer: function (currentPage, pageCount) {
            return {
                margin: [30, 10], // Margem do rodapé
                columns: [
                    { text: 'Data: ' + str_data + ' - Hora: ' + str_hora, style: 'bodyText' , style: 'footerText' },
                    { text: 'Documento gerado automaticamente.', style: 'footerText' },
                    { text: `Página ${currentPage} de ${pageCount}`, alignment: 'right', style: 'footerText' }
                ]
            };
        },

        // 📌 ESTILOS CSS (Personalização)
        styles: {
            headerTitle: {
                fontSize: 14,
                bold: true,
                alignment: 'left'
            },
            title: {
                fontSize: 16,
                bold: true,
                alignment: 'center',
                margin: [0, 20, 0, 10]
            },
            bodyText: {
                fontSize: 12,
                alignment: 'justify',
                margin: [0, 10],
                color: ' blue'
            },
            footerText: {
                fontSize: 10,
                italics: true,
                color: 'gray'
            },

        }
    };



   //pdfMake.createPdf(docDefinition).download("TestPdfMake.pdf");
   //pdfMake.createPdf(docDefinition).open();
   //pdfMake.createPdf(docDefinition).print();

const pdfDocGenerator = pdfMake.createPdf(docDefinition);
pdfDocGenerator.open();

}

