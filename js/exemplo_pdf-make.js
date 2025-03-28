function jstreinaeventospessoa(num_pagina) {

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

	var jsondata = $v('P' + num_pagina + '_JSON_DATA');

	var jsondataobject = JSON.parse(jsondata);

	var historicos = jsondataobject.historicos;
	var elementlogo = document.getElementById('P' + num_pagina + '_LOGO').toDataURL("image/jpeg");
	var data = new Date();
	var dia = data.getDate();           // 1-31
	var mes = data.getMonth();          // 0-11 (zero=janeiro)
	var ano = data.getFullYear();       // 4 dígitos
	var hora = data.getHours();          // 0-23
	var min = data.getMinutes();        // 0-59
	var seg = data.getSeconds();        // 0-59
	var str_data = dia + '/' + (mes + 1) + '/' + ano;
	var str_hora = hora + ':' + min + ':' + seg;
	var loginquemgerou = $v('P' + num_pagina + '_USER');

	if (historicos && historicos.length > 0) {
		var historico = historicos[0];
	}

	
	var titulo = "CAPACITAÇÃO";
	
	var docDefinition = {
		pageSize: 'A4',
		pageMargins: [30, 45],
		content: [
			{
				style: 'tableExample', margin: [0, 0, 30, 20], alignment: 'left',
				table: {
					body: [
						[{ image: elementlogo, width: 40 }, { text: 'SECRETARIA DE POLÍCIA DO SENADO FEDERAL\nServiço de Treinamento e Projetos', margin: [0, 10, 0, 0] }]
					]
				},
				layout: {
					defaultBorder: false,
				}
			},

			{ text: titulo, style: 'header', alignment: 'center' },
			'\n\n',
			'\n\n',
			{ text: 'Policial: ' + historico.pessoa + ' - ' + historico.mat, alignment: 'center' },
			'\n\n',
			{
				style: 'tableExample', margin: [0, 0, 30, 20], alignment: 'center',
				table: {
					widths: [300, 100, 100],
					body: [
						['Eventos', 'Início', 'Fim'],
					]
				}
			},
			//{ text: 'Obs: ' + (historico.obs ?? " "), alignment: 'left' },
			{
				text: [
					'Obs: Exceto eventos em andamento.'
				],
				fontSize: 10
			},
			'\n\n',
			{ text: 'Brasília, ' + str_data, margin: [30, 0, 30, 20], alignment: 'right' },
			'\n\n',
			'\n\n',
			{ text: 'TREINA - emissão: ' + str_data + '  ' + str_hora + '     Gerado por: ' + loginquemgerou, fontSize: 8 },

		],
		styles: {
			header: {
				fontSize: 18,
				bold: true,
				margin: [0, 0, 0, 10]
			},
			subheader: {
				fontSize: 16,
				bold: true,
				margin: [0, 10, 0, 5]
			},
			tableExample: {
				margin: [0, 5, 0, 15]
			},
			tableHeader: {
				bold: true,
				fontSize: 13,
				color: 'black'
			}
		},
		defaultStyle: {
			// alignment: 'justify'
		},
	};

	var eventos = historico.eventos;   
	if (eventos && eventos.length > 0) {
		for (let i = 0; i < eventos.length; i++) {
			const evento = eventos[i];

			docDefinition.content[6].table.body.push([evento.desEven, evento.datIni, evento.datFim]);
		}
	}


	pdfMake.createPdf(docDefinition).open();
}


function jstreinacapacitadosevento(num_pagina) {

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

	var jsondata = $v('P' + num_pagina + '_JSON_DATA');

	var jsondataobject = JSON.parse(jsondata);

	var historicos = jsondataobject.historicos;
	var elementlogo = document.getElementById('P' + num_pagina + '_LOGO').toDataURL("image/jpeg");
	var data = new Date();
	var dia = data.getDate();           // 1-31
	var mes = data.getMonth();          // 0-11 (zero=janeiro)
	var ano = data.getFullYear();       // 4 dígitos
	var hora = data.getHours();          // 0-23
	var min = data.getMinutes();        // 0-59
	var seg = data.getSeconds();        // 0-59
	var str_data = dia + '/' + (mes + 1) + '/' + ano;
	var str_hora = hora + ':' + min + ':' + seg;
	var loginquemgerou = $v('P' + num_pagina + '_USER');

	if (historicos && historicos.length > 0) {
		var historico = historicos[0];
	}

	
	var titulo = "CAPACITAÇÃO";
	
	var docDefinition = {
		pageSize: 'A4',
		pageMargins: [30, 45],
		content: [
			{
				style: 'tableExample', margin: [0, 0, 30, 20], alignment: 'left',
				table: {
					body: [
						[{ image: elementlogo, width: 40 }, { text: 'SECRETARIA DE POLÍCIA DO SENADO FEDERAL\nServiço de Treinamento e Projetos', margin: [0, 10, 0, 0] }]
					]
				},
				layout: {
					defaultBorder: false,
				}
			},

			{ text: titulo, style: 'header', alignment: 'center' },
			'\n\n',
			'\n\n',
			{ text: 'Evento: ' + historico.desEven, alignment: 'center' },
			{ text: 'Período: ' + historico.pesqInicio + ' a ' + historico.pesqFim, alignment: 'center' },
			'\n\n',
			{
				style: 'tableExample', margin: [30, 0, 30, 20], alignment: 'center',
				table: {
					widths: [350, 80],
					body: [
						['Capacitados', 'Matr.'],
					]
				}
			},
			//{ text: 'Obs: ' + (historico.obs ?? " "), alignment: 'left' },
			{
				text: [
					'Obs: xxxxxxxxxxxxx'
				],
				fontSize: 10
			},
			'\n\n',
			{ text: 'Brasília, ' + str_data, margin: [30, 0, 30, 20], alignment: 'right' },
			'\n\n',
			'\n\n',
			{ text: 'TREINA - emissão: ' + str_data + '  ' + str_hora + '     Gerado por: ' + loginquemgerou, fontSize: 8 },

		],
		styles: {
			header: {
				fontSize: 18,
				bold: true,
				margin: [0, 0, 0, 10]
			},
			subheader: {
				fontSize: 16,
				bold: true,
				margin: [0, 10, 0, 5]
			},
			tableExample: {
				margin: [0, 5, 0, 15]
			},
			tableHeader: {
				bold: true,
				fontSize: 13,
				color: 'black'
			}
		},
		defaultStyle: {
			// alignment: 'justify'
		},
	};

	var capacitados = historico.capacitados;   
	if (capacitados && capacitados.length > 0) {
		for (let i = 0; i < capacitados.length; i++) {
			const capacitado = capacitados[i];

			docDefinition.content[7].table.body.push([capacitado.pessoa, capacitado.mat]);
		}
	}


	pdfMake.createPdf(docDefinition).open();
}
