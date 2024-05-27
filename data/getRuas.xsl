<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs"
    version="2.0">
    
    <xsl:output method="xml" indent="yes"/>
    
    <xsl:template match="mapa">
            <ruas>
                <xsl:for-each select="document(rua/@doc)">
                    <xsl:apply-templates mode="ruas"/>
                </xsl:for-each>
            </ruas>
    </xsl:template>
    
    <xsl:template mode="ruas" match="rua">
        <xsl:copy-of select="."/>
    </xsl:template>
    
    <xsl:template mode="ruas" match="rua">
        <rua>
            <nome><xsl:value-of select="meta/nome"/></nome>
            <número><xsl:value-of select="meta/número"/></número>
        </rua>
    </xsl:template>
    
    <!-- garbage colector -->
    <xsl:template mode="datas" match="text()" priority="-1"/>  
    
</xsl:stylesheet>