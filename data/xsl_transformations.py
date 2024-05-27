from lxml import etree
import html

xsd_path = 'MRB-rua.xsd'
index_path = 'indiceruas.xml'
xslt_paths = {
    'getRuas.xsl': 'ruas.xml',
    'getEntidades.xsl': 'entidades.xml',
    'getlugares.xsl': 'lugares.xml'
}

with open(xsd_path, 'rb') as xsd_file:
    xsd_doc = etree.XML(xsd_file.read())
    xsd_schema = etree.XMLSchema(xsd_doc)


def validate_xml(xml_path):
    with open(xml_path, 'rb') as xml_file:
        xml_doc = etree.XML(xml_file.read())
        if xsd_schema.validate(xml_doc):
            print(f"{xml_path} is valid.")
        else:
            print(f"{xml_path} is invalid!")
            log = xsd_schema.error_log
            print(log)


index_tree = etree.parse(index_path)
index_root = index_tree.getroot()

for rua in index_root.findall('rua'):
    doc_path = rua.get('doc')
    validate_xml(doc_path)


def transform_xml(xml_input_path, xslt_path, output_path):
    try:
        xml_input = etree.parse(xml_input_path)
        xslt = etree.parse(xslt_path)      
        transform = etree.XSLT(xslt)
        result = transform(xml_input)
        
        if etree.tostring(result) is None:
            print(f"Transformation failed for {xml_input_path} with {xslt_path}")
            print(transform.error_log)
        else:
            with open(output_path, 'w') as output_file:
                output_file.write('<?xml version="1.0" encoding="UTF-8"?>\n' + html.unescape(etree.tostring(result, pretty_print=True).decode("utf-8")))
            print(f"Generated {output_path} using {xslt_path}")
    except (etree.XMLSyntaxError, etree.XSLTParseError, etree.XSLTApplyError) as e:
        print(f"Error during transformation of {xml_input_path} with {xslt_path}: {e}")


for xslt_path, output_name in xslt_paths.items():
    output_path = output_name
    transform_xml(index_path, xslt_path, output_path)
