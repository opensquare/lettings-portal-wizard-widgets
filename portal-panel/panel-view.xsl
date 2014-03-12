<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:output method="html"/>
    <xsl:template match="/">
        <div class="items-container">
            <xsl:choose>
                <!-- result set will be removed. ESB will automatically return required results by passing uid-->
                <xsl:when test="/response/resultSet/@type='{set}'">
                    <xsl:call-template name="container">
                        <xsl:with-param name="set" select="/response/resultSet[@type='{set}']"/>
                    </xsl:call-template>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:call-template name="container">
                        <xsl:with-param name="set" select="/response"/>
                    </xsl:call-template>
                </xsl:otherwise>
            </xsl:choose>
        </div>
    </xsl:template>

    <xsl:template name="container">
        <xsl:param name="set"/>
        <div class="ic-heading">
            <xsl:if test="$set/imagePath!=''">
                <div class="ic-image">Image placeholder <xsl:value-of select="$set/imagePath"/></div>
            </xsl:if>
            <xsl:choose>
                <xsl:when test="$set/headerTarget!=''">
                    <a>
                        <xsl:attribute name="href"><xsl:value-of select="$set/headerTarget"/></xsl:attribute>
                        <xsl:value-of select="$set/header"/>
                    </a>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="$set/header"/>
                </xsl:otherwise>
            </xsl:choose>
            <div class="ic-subtext">
                <xsl:value-of select="$set/subtext" disable-output-escaping="yes"/>
            </div>
        </div>
        <xsl:apply-templates select="$set/partyprogress"/>
        <xsl:apply-templates select="$set/items"/>
    </xsl:template>

    <xsl:template match="partyprogress">
        <div class="ic-progress-set">
            <xsl:apply-templates select="progress"/>
        </div>
    </xsl:template>

    <xsl:template match="progress">
        <div class="ic-progress">
            <div class="ic-progress-status">
                <xsl:value-of select="status"/>
            </div>
            <div class="ic-progress-party">
                <xsl:value-of select="partytype"/>
            </div>
        </div>
    </xsl:template>

   <xsl:template match="items">
        <xsl:variable name="uids" select="tokenize('{uids}', ',')"/>
        <xsl:variable name="items" select="item"/>
        <div class="ic-contents">
            <!-- iteration and uid parameter test for dev purposes only. In actual build correct entities will be returned in response so only apply templates on item will need calling-->
            <xsl:choose>
                <xsl:when test="$uids=concat('{','uids','}')">
                    <xsl:apply-templates select="item"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:for-each select="$uids">
                        <xsl:variable name="currentUid" select="."/>
                        <xsl:for-each select="$items">
                            <xsl:variable name="currentItem" select="."/>
                            <xsl:if test="$currentUid=$currentItem/@uid">
                                <xsl:apply-templates select="$currentItem"/>
                            </xsl:if>
                        </xsl:for-each>
                    </xsl:for-each>
                </xsl:otherwise>
            </xsl:choose>
        </div>
   </xsl:template>

   <xsl:template match="item">
        <xsl:variable name="displayType">
            <xsl:choose>
                <xsl:when test="@display!=''">
                    <xsl:value-of select="@display"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="'{displayType}'"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable> 
        <div>
            <xsl:attribute name="class">ic-item ic-type-<xsl:value-of select="$displayType"/></xsl:attribute>
            <xsl:attribute name="data-uid"><xsl:value-of select="@uid"/></xsl:attribute>
            <div class="ic-item-text">
                <xsl:value-of select="text"/>
            </div>
            <xsl:for-each select="links/link">
                <xsl:choose>
                    <xsl:when test="$displayType='links'">
                        <div class="ic-link">
                            <xsl:choose>
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
                    </xsl:when>
                    <xsl:when test="$displayType='button'">
                        <div class="ic-button">
                            <button>
                                <xsl:attribute name="data-button-target"><xsl:value-of select="portalTarget"/></xsl:attribute>
                                <xsl:value-of select="displayText"/>
                            </button>
                        </div>
                    </xsl:when>
                    <xsl:when test="$displayType='multiple-text'">
                        <div class="ic-mtext-item">
                            <div class="ic-mtext-main">
                                <xsl:value-of select="displayText"/>
                            </div>
                            <div class="ic-mtext-sub">
                                <xsl:value-of select="subText"/>
                            </div>
                        </div>
                    </xsl:when>
                    <xsl:when test="$displayType='text'"></xsl:when>
                </xsl:choose>
            </xsl:for-each>
        </div>
   </xsl:template>

    
</xsl:stylesheet>
