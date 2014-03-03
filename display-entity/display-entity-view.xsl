<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:output method="html"/>
    <xsl:template match="/">
        <div class="entities">
            <xsl:apply-templates select="response//entity[@type='{entitytype}']"/>
        </div>
    </xsl:template>

    <xsl:template match="entity">
        <div class="entity">
            <xsl:apply-templates select="description"/>
            <xsl:if test="properties">
                <xsl:apply-templates select="properties"/>
            </xsl:if>
            <xsl:apply-templates select="entity"/>
        </div>
    </xsl:template>

    <xsl:template match="description">
        <h3 class="entity-description entity-section entity-heading"><xsl:value-of select="."/></h3>
    </xsl:template>

    <xsl:template match="properties">
        <div class="entity-section entity-properties">
            <xsl:for-each select="property[position() mod 2 = 1]">
                <div class="row">
                    <xsl:apply-templates select=".|following-sibling::property[position() &lt; 2]"/>
                </div>
            </xsl:for-each>
        </div>
    </xsl:template>

    <xsl:template match="property">
        <div class="col-sm-6">
            <span style="display:inline-block;width:50%">
                <xsl:attribute name="class">entity-property <xsl:value-of select="translate(@name, ' ', '-')"/></xsl:attribute>
                <strong><xsl:value-of select="@name"/></strong>
            </span>
            <span><xsl:value-of select="."/></span>
        </div>
    </xsl:template>

    
</xsl:stylesheet>
