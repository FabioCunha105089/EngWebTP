<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs"
    version="2.0">
    
    <xsl:output method="xml" indent="yes"/>
    
    <!-- Define a key for unique (nome, rua) pairs -->
    <xsl:key name="lugarKey" match="lugar" use="concat(., '|', /rua/meta/número)"/>
    
    <xsl:template match="mapa">
        <lugares>
            <xsl:for-each select="document(rua/@doc)">
                <xsl:apply-templates mode="lugares"/>
            </xsl:for-each>
        </lugares>
    </xsl:template>
    
    <xsl:template mode="lugares" match="lugar">
        <!-- Select only the first occurrence of each unique (nome, rua) pair -->
        <xsl:if test="generate-id() = generate-id(key('lugarKey', concat(., '|', /rua/meta/número))[1])">
            <lugar>
                <nome><xsl:value-of select="."/></nome>
                <rua><xsl:value-of select="/rua/meta/número"/></rua>
            </lugar>
        </xsl:if>
    </xsl:template>
    
    <!-- garbage collector -->
    <xsl:template mode="lugares" match="text()" priority="-1"/>
    
</xsl:stylesheet>
