import xml.etree.ElementTree as ET
import json
import os
import re

def clean_strings(s):
    s = s.replace('\n', '').replace('\"', '').replace('D.', 'D. ').replace('S.', 'S. ').rstrip().lstrip()
    s = ' '.join(s.split())
    return s

def format_paragraph(paragraphs):
    para_list =  []
    for paragraph in paragraphs:
        full_paragraph = ''
        if paragraph.text:
            full_paragraph += paragraph.text
        for child in paragraph:
            if child.tag == 'data':
                full_paragraph += child.text
            else:
                if child.tag == 'lugar':
                    path = 'lugares'
                else:
                    path = 'entidades'
                caps = []
                for w in child.text.split():
                    caps.append(w.upper())
                caps = '_'.join(caps)
                full_paragraph += f'<a href="/{path}/{caps}">{child.text}</a>'
            if child.tail:
                full_paragraph += child.tail
        para_list.append(clean_strings(full_paragraph))
    return para_list

ruas = []

for dirpath, _, files in os.walk('./texto'):
    for filename in files:
        path_to_file = dirpath + '/' + filename
        with open(path_to_file, 'r') as xml_file:
            xml_rua = xml_file.read()
            root = ET.fromstring(xml_rua)
            meta = root.find('meta')
            corpo = root.find('corpo')
            paragrafos = corpo.findall('para')
            para_list = format_paragraph(paragrafos)

            figuras_list = []
            figuras = corpo.findall('figura')
            for figura in figuras:
                figuras_list.append({
                    'foto_id': figura.attrib['id'],
                    'path': figura.find('imagem').attrib['path'],
                    'legenda': figura.find('legenda').text
                })
            lista_casas = corpo.find('lista-casas')
            if lista_casas and len(lista_casas) > 0:
                casas = lista_casas.findall('casa')
                if casas and len(casas) > 0:
                    casas_list = []
                    for casa in casas:
                        numero = casa.find('número').text
                        if numero == '-':
                             continue
                        enfiteuta = casa.find('enfiteuta')
                        enfiteuta_text = ''
                        if enfiteuta is not None:
                            enfiteuta_text = enfiteuta.text
                        foro = casa.find('foro')
                        foro_text = ''
                        if foro is not None:
                            foro_text = foro.text
                        desc = ''
                        if d := casa.find('desc'):
                            desc = format_paragraph(d)                        
                        casas_list.append({
                            'numero': numero,
                            'enfiteuta': enfiteuta_text,
                            'desc': desc,
                            'foro': foro_text
                        })
                        ###
            ruas.append({
                '_id': int(meta.find('número').text),
                'nome': meta.find('nome').text,
                'desc': para_list,
                'figuras': figuras_list,
                'casas': casas_list
            })

with open('./ruas.json', 'w') as file:
    file.write(json.dumps(ruas, indent=2, ensure_ascii=False))
            



