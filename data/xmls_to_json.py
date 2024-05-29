import xml.etree.ElementTree as ET
import json

def clean_strings(s):
    s = s.replace('\n', '').replace('\"', '').replace('D.', 'D. ').replace('S.', 'S. ').rstrip().lstrip()
    spl = s.split()
    res = []
    for w in spl:
        w = w.upper()
        res.append(w)
    s = '_'.join(res)
    return s 

with open('lugares.xml', 'r') as xml_file:
    xml_lugares = xml_file.read()


root = ET.fromstring(xml_lugares)

lugares_list = []
nomes_lugares = {}
i = 1
for lugar in root.findall('lugar'):
    nome = lugar.find('nome').text
    nome = clean_strings(nome)
    if nome not in nomes_lugares.keys():
        nomes_lugares[nome] = []
    rua = lugar.find('rua').text
    if rua not in nomes_lugares[nome]:
        nomes_lugares[nome].append(rua)
for lug_nome, lug_ruas in nomes_lugares.items():
    lugares_list.append({
            '_id': i,
            'nome': lug_nome,
            'ruas': lug_ruas
        })
    i += 1

with open('lugares.json', 'w') as json_file:
    json_file.write(json.dumps(lugares_list, indent=2, ensure_ascii=False))


with open('entidades.xml', 'r') as xml_file:
    xml_entidades = xml_file.read()


root = ET.fromstring(xml_entidades)

entidades_list = []
nomes = {}
i = 0
for entidade in root.findall('entidade'):
    _id = str(i)
    tipo = entidade.find('tipo').text
    nome = entidade.find('nome').text
    nome = clean_strings(nome)
    if nome not in nomes.keys():
        nomes[nome] = []
    numero = entidade.find('número').text
    quantidade = entidade.find('quantidade').text
    nomes[nome].append({'numero': numero, 'quantidade': quantidade})

for ent_nome, ent_info in nomes.items():
    entidades_list.append({
        '_id': i,
        'tipo': tipo,
        'nome': ent_nome,
        'info': ent_info
    })
    i += 1

with open('entidades.json', 'w') as json_file:
    json_file.write(json.dumps(entidades_list, indent=2, ensure_ascii=False))