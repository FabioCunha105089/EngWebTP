const xml2js = require('xml2js')

function cleanStrings(s) {
  s = s.replace(/\n/g, '').replace(/\"/g, '').replace(/D\./g, 'D. ').replace(/S\./g, 'S. ').trim();
  s = s.replace(/\s+/g, ' ');
  return s;
}

function formatParagraph(paragraphs) {
  const paraList = [];
  for (const p of paragraphs) {
    var paragraph = null
    if (typeof p !== 'string') {
      paragraph = p['para'][0]
    }
    else
    {
      paragraph = p
    }
    let fullParagraph = '';
    const segments = paragraph.split(/(<lugar>|<\/lugar>|<entidade>|<\/entidade>|<data>|<\/data>)/);
    var insideTag = false
    segments.forEach(segment => {
      if (segment === '<data>' || segment === '</data>') {} 
      else if (segment === '<lugar>') {
          fullParagraph += '<a href="/lugar/';
          insideTag = true
      } else if (segment === '<entidade>') {
          fullParagraph += '<a href="/entidade/';
          insideTag = true
      } else if (segment === '</lugar>' || segment === '</entidade>') {
        fullParagraph += '</a>'
      } else {
          if (!insideTag) {
            fullParagraph += segment;
          }
          else {
            const tag_value = segment.toUpperCase().split(' ').join('_')
            fullParagraph += tag_value + '">' + segment
            insideTag = false
          }
      }
  });
    paraList.push(cleanStrings(fullParagraph));
  }
  return paraList;
}

function processFile(xmlContent) {
  let resultJson = null;

  xml2js.parseString(xmlContent, (err, result) => {
    if (err) {
      throw err;
    }
    const root = result.rua;
    const meta = root.meta[0];
    const corpo = root.corpo[0];

    const paragrafos = corpo.para || [];
    const paraList = formatParagraph(paragrafos);

    const figurasList = (corpo.figura || []).map(figura => ({
      foto_id: figura.$.id,
      path: figura.imagem[0].$.path,
      legenda: figura.legenda[0]
    }));

    const listaCasas = corpo['lista-casas'] ? corpo['lista-casas'][0] : null;
    const casasList = listaCasas ? (listaCasas.casa || []).map(casa => {
      const numero = casa.número[0];
      if (numero === '-') {
        return null;
      }
      const enfiteuta = casa.enfiteuta ? casa.enfiteuta[0] : '';
      const foro = casa.foro ? casa.foro[0] : '';
      const desc = casa.desc ? formatParagraph(casa.desc) : '';
      return {
        numero,
        enfiteuta,
        desc,
        foro
      };
    }).filter(Boolean) : [];

    resultJson = {
      _id: parseInt(meta.número[0]),
      nome: meta.nome[0],
      desc: paraList,
      figuras: figurasList,
      casas: casasList,
      comentarios: []
    };
  });

  return resultJson;
}

module.exports = { processFile }