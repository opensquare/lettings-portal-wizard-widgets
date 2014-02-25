<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:output method="html"/>
    <xsl:template match="/">
        <div class="record">
            <xsl:choose>
                <xsl:when test="response/entity">
                    <xsl:apply-templates select="response/entity"/>
                </xsl:when>
                <xsl:otherwise>
                    No actions available
                </xsl:otherwise>
            </xsl:choose>
        </div>
    </xsl:template>
    <xsl:template match="entity">
        <div>
            <xsl:choose>
                <xsl:when test="entity">
                    <xsl:attribute name="class">row</xsl:attribute>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:attribute name="class">col-sm-4</xsl:attribute>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:attribute name="data-type"><xsl:value-of select="@type"/></xsl:attribute>
            <div>
                <xsl:if test="entity">
                    <xsl:attribute name="class">col-sm-4</xsl:attribute>
                </xsl:if>
                <h3><xsl:value-of select="description"/></h3>
                <a>
                    <xsl:attribute name="href">#<xsl:value-of select="widget"/>?<xsl:value-of select="@uid"/></xsl:attribute>
                    <strong>
                        <xsl:value-of select="status"/> - <xsl:value-of select="completed"/> of <xsl:value-of select="total"/> steps complete
                    </strong>
                </a>
            </div>
            <xsl:if test="entity">
                <xsl:apply-templates select="entity"/>
            </xsl:if>
            <xsl:if test="action">
                <div class="col-sm-2">
                    <xsl:apply-templates select="action"/>
                </div>
            </xsl:if>
            <xsl:if test="message">
                <div class="col-sm-2">
                    <xsl:apply-templates select="message"/>
                </div>
            </xsl:if>
        </div>
    </xsl:template>
    <xsl:template match="action">
        <xsl:choose>
            <xsl:when test="widget">
                <button type="button" class="btn btn-primary">
                    <xsl:attribute name="data-action"><xsl:value-of select="widget"/></xsl:attribute>
                    <xsl:value-of select="description"/>
                </button>
            </xsl:when>
            <xsl:otherwise>generic view action</xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    <xsl:template match="message">
        <xsl:choose>
            <xsl:when test="widget">
                <div class="alert alert-info">
                    <a class="alert-link">
                        <xsl:attribute name="href">#<xsl:value-of select="widget"/></xsl:attribute>
                        <xsl:value-of select="description"/>
                    </a>
                </div>
            </xsl:when>
            <xsl:otherwise></xsl:otherwise>
        </xsl:choose>
    </xsl:template>
</xsl:stylesheet>
