<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:output method="html"/>
    <xsl:template match="/">
        <ul>
            <xsl:choose>
                <xsl:when test="count(/response/status) &gt; 0">
                    <xsl:apply-templates select="/response/status"/>
                </xsl:when>
                <xsl:otherwise>
                    <li>Status information not available</li>
                </xsl:otherwise>
            </xsl:choose>
        </ul>
    </xsl:template>

    <xsl:template match="status">
        <li>
            <div>
                <xsl:attribute name="class">
                    <xsl:text>bc-status </xsl:text>
                    <xsl:value-of select="progress"/>
                </xsl:attribute>
                <strong><xsl:value-of select="description"/></strong>
            </div>
        </li>
    </xsl:template>
</xsl:stylesheet>