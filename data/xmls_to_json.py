import xml.etree.ElementTree as ET
import json
# Ruas
with open('ruas.xml', 'r') as xml_file:
    xml_ruas = xml_file.read()
    
root = ET.fromstring(xml_ruas)

ruas_list = []
for rua in root.findall('rua'):
    nome = rua.find('nome').text
    numero = rua.find('número').text
    ruas_list.append({
      '_id': numero,
      'nome': nome
    })

with open('ruas.json', 'w') as json_file:
    json_file.write(json.dumps(ruas_list, indent=2, ensure_ascii=False))
    

with open('lugares.xml', 'r') as xml_file:
    xml_lugares = xml_file.read()


root = ET.fromstring(xml_lugares)

lugares_list = []
for i, lugar in enumerate(root.findall('lugar'), start=1):
    _id = str(i)
    nome = lugar.find('nome').text
    rua = lugar.find('rua').text
    lugares_list.append({
        '_id': _id,
        'nome': nome,
        'rua': rua
    })

with open('lugares.json', 'w') as json_file:
    json_file.write(json.dumps(lugares_list, indent=2, ensure_ascii=False))


# TODO Entidades para json. Agrupar por tipo