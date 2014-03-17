<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:output method="html"/>
    <xsl:template match="/">
        <xsl:variable name="uids" select="tokenize('{uids}', ',')"/>
        <xsl:variable name="sets" select="response/resultSet"/>
        <div class="items-container">
            <xsl:for-each select="$uids">
                <xsl:variable name="currentUid" select="."/>
                <xsl:for-each select="$sets">
                    <xsl:variable name="currentSet" select="."/>
                    <xsl:if test="$currentUid=$currentSet/@entity">
                        <xsl:apply-templates select="$currentSet"/>
                    </xsl:if>
                </xsl:for-each>
            </xsl:for-each>
        </div>
    </xsl:template>

    <xsl:template match="resultSet">
        <div class="ic-heading">
            <xsl:if test="imagePath!=''">
                <div class="ic-image">Image placeholder <xsl:value-of select="imagePath"/></div>
            </xsl:if>
            <xsl:choose>
                <xsl:when test="headerTarget!=''">
                    <a>
                        <xsl:attribute name="href"><xsl:value-of select="headerTarget"/></xsl:attribute>
                        <xsl:value-of select="header"/>
                    </a>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="header"/>
                </xsl:otherwise>
            </xsl:choose>
            <div class="ic-subtext">
                <xsl:value-of select="subtext" disable-output-escaping="yes"/>
            </div>
        </div>
        <xsl:apply-templates select="itemSet"/>
    </xsl:template>


   <xsl:template match="itemSet">
        <div class="ic-item-set">
            <xsl:attribute name="data-uid"><xsl:value-of select="@uid"/></xsl:attribute>
            <xsl:apply-templates select="item"/>
        </div>
   </xsl:template>

   <xsl:template match="item">
        <div>
            <xsl:attribute name="class">is-item is-type-<xsl:value-of select="@type"/></xsl:attribute>
            <xsl:attribute name="data-uid"><xsl:value-of select="@uid"/></xsl:attribute>
            <div class="is-item-text">
                <xsl:value-of select="itemText"/>
            </div>
            <xsl:apply-templates select="*"/>
        </div>
   </xsl:template>

    <xsl:template match="progress">
        <div class="item-progress">
            <div class="item-progress-status">
                <xsl:value-of select="status"/>
            </div>
            <div class="item-progress-party">
                <xsl:value-of select="partytype"/>
            </div>
        </div>
    </xsl:template>

    <xsl:template match="links">
        <xsl:apply-templates select="link"/>
    </xsl:template>

    <xsl:template match="link">
        <div class="item-link">
            <xsl:choose>
                <xsl:when test="'{linkType}' = 'buttons'">
                    <div class="item-button">
                        <button>
                            <xsl:attribute name="data-button-target"><xsl:value-of select="portalTarget"/></xsl:attribute>
                            <xsl:value-of select="displayText"/>
                        </button>
                    </div>
                </xsl:when>
                <xsl:when test="portalTarget!=''">
                    <a>
                        <xsl:attribute name="href"><xsl:value-of select="portalTarget"/></xsl:attribute>
                        <xsl:value-of select="displayText"/>
                    </a>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="displayText"/>
                </xsl:otherwise>
            </xsl:choose>
        </div>
    </xsl:template>

    <xsl:template match="textItems">
        <xsl:apply-templates select="textItem"/>
    </xsl:template>

    <xsl:template match="textItem">
        <div class="item-mtext-item">
            <div class="item-mtext-main">
                <xsl:value-of select="text"/>
            </div>
            <div class="item-mtext-sub">
                <xsl:value-of select="subText"/>
            </div>
        </div>
    </xsl:template>

    <xsl:template match="node()|text()"></xsl:template>
</xsl:stylesheet>
