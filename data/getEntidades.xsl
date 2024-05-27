<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs"
    version="2.0">
    
    <xsl:output method="xml" indent="yes"/>

    <!-- Define a key for unique (nome, rua) pairs -->
    <xsl:key name="entidadeKey" match="entidade" use="concat(., '|', /rua/meta/número)"/>

    <xsl:template match="mapa">
        <entidades>
            <xsl:for-each select="document(rua/@doc)">
                <xsl:apply-templates mode="entidades"/>
            </xsl:for-each>
        </entidades>
    </xsl:template>

    <xsl:template match="entidade" mode="entidades">
        <!-- Select only the first occurrence of each unique (nome, rua) pair -->
        <xsl:if test="generate-id() = generate-id(key('entidadeKey', concat(., '|', /rua/meta/número))[1])">
            <entidade>
                <tipo><xsl:value-of select="@tipo"/></tipo>
                <nome><xsl:value-of select="."/></nome>
                <número><xsl:value-of select="/rua/meta/número"/></número>
                <quantidade><xsl:value-of select="count(key('entidadeKey', concat(., '|', /rua/meta/número)))"/></quantidade>
            </entidade>
        </xsl:if>
    </xsl:template>

    <!-- garbage collector -->
    <xsl:template mode="entidades" match="text()" priority="-1"/>
</xsl:stylesheet>
