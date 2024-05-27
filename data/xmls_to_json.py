import xml.etree.ElementTree as ET
import json

with open('ruas.xml', 'r') as xml_file:
    xml_ruas = xml_file.read()
    
# Parse the XML
root = ET.fromstring(xml_ruas)

# Transform the XML to the desired JSON structure
ruas_list = []
for rua in root.findall('rua'):
    nome = rua.find('nome').text
    numero = rua.find('número').text
    ruas_list.append({
      '_id': numero,
      'nome': nome
    })

# Convert to JSON
json_output = json.dumps(ruas_list, indent=2, ensure_ascii=False)

# Write to a JSON file
with open('ruas.json', 'w') as json_file:
    json_file.write(json_output)
