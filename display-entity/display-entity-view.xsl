<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:output method="html"/>
    <xsl:template match="/">
        <div class="entities">
            <xsl:apply-templates select="response//entity[@type='{entitytype}']"/>
        </div>
    </xsl:template>

    <xsl:template match="entity">
        <xsl:param name="depth" select="1" />
        <div class="entity">
            <div class="row entity-section entity-heading">
                <div class="col-sm-9">
                    <h3 class="entity-description">
                        <xsl:value-of select="description"/><xsl:text> </xsl:text><small><xsl:value-of select="status"/></small>
                    </h3>
                </div>
            </div>
            <xsl:if test="properties">
                <xsl:apply-templates select="properties"/>
            </xsl:if>
            <xsl:if test="{depth} &gt; $depth">
                <xsl:apply-templates select="entity">
                    <xsl:with-param name="depth" select="$depth + 1"/>
                </xsl:apply-templates>
            </xsl:if>
        </div>
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
        <xsl:choose>
            <xsl:when test="@name!='Description Text'">
                <div class="col-sm-4 entity-property">
                    <span style="display:inline-block;width:20%">
                        <xsl:attribute name="class">entity-property-name <xsl:value-of select="translate(@name, ' ', '-')"/></xsl:attribute>
                        <strong><xsl:value-of select="@name"/></strong>
                    </span>
                    <span class="entity-property-value"><xsl:value-of select="."/></span>
                </div>
            </xsl:when>
            <xsl:otherwise>
                <div class="col-sm-8 entity-property">
                    <span class="entity-property-value" style="width:100%"><xsl:value-of select="."/></span>
                </div>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    
</xsl:stylesheet>
