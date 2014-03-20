<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:output method="html"/>
    
    <xsl:variable name="setPH" select="concat('{', 'set', '}')"/>

    <xsl:variable name="asButtons">
        <xsl:for-each select="tokenize('{show}', ',')">
            <link>
                <xsl:attribute name="for"><xsl:value-of select="."/></xsl:attribute>
                <xsl:if test="contains('{asButtons}', .)">true</xsl:if>
            </link>
        </xsl:for-each>
    </xsl:variable>
    
    <xsl:template match="/">
        <xsl:variable name="uid" select="tokenize('{uids}', ',')"/>
        <xsl:variable name="display" select="tokenize('{show}', ',')"/>
        <xsl:variable name="displayHeader" select="'{header}' = 'true'"/>
        <xsl:variable name="sets" select="response/resultSet"/>
        
        <div class="items-container">
            <xsl:for-each select="$uid">
                <xsl:variable name="thisUid" select="."/>
                
                <!-- find relevant result set -->
                <xsl:variable name="rs" select="$sets[@entity=$thisUid]"/>
                <!-- show header -->
                <xsl:if test="$displayHeader">
                    <xsl:call-template name="showHeader">
                        <xsl:with-param name="resultSet" select="$rs"/>
                    </xsl:call-template>
                </xsl:if>

                <!-- display each required item set -->
                <xsl:for-each select="$display">
                    <xsl:variable name="displayName" select="."/>
                    
                    <xsl:choose>
                        <xsl:when test="count($rs/itemSet[@name=$displayName]) &gt; 0">
                            <xsl:apply-templates select="$rs/itemSet[@name=$displayName]"/>
                        </xsl:when>

                        <!--add empty item set-->
                        <xsl:otherwise>
                            <xsl:call-template name="itemSet">
                                <xsl:with-param name="empty" select="true()"/>
                            </xsl:call-template>
                        </xsl:otherwise>
                    </xsl:choose>

                </xsl:for-each>

            </xsl:for-each>
        </div>
    </xsl:template>

    <xsl:template name="showHeader">
        <xsl:param name="resultSet"/>
        <div class="ic-heading">
            <xsl:if test="$resultSet/imagePath!=''">
                <div class="ic-image">Image placeholder <xsl:value-of select="$resultSet/imagePath"/></div>
            </xsl:if>
            <xsl:choose>
                <xsl:when test="$resultSet/headerTarget!=''">
                    <a>
                        <xsl:attribute name="href"><xsl:value-of select="$resultSet/headerTarget"/></xsl:attribute>
                        <xsl:value-of select="$resultSet/header"/>
                    </a>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="$resultSet/header"/>
                </xsl:otherwise>
            </xsl:choose>
            <div class="ic-subtext">
                <xsl:value-of select="$resultSet/subtext" disable-output-escaping="yes"/>
            </div>
        </div>
    </xsl:template>


    <xsl:template match="itemSet" name="itemSet">
        <!-- /.. is equivalent to empty node set -->
        <xsl:param name="empty" select="false()"/>
        <div class="ic-item-set">
            <xsl:if test="not($empty)">
                <xsl:attribute name="data-uid"><xsl:value-of select="../@entity"/></xsl:attribute>
                <xsl:apply-templates select="item"/>
            </xsl:if>
        </div>
    </xsl:template>

   <xsl:template match="item">
        <div>
            <xsl:attribute name="class">is-item is-type-<xsl:value-of select="@type"/></xsl:attribute>
            <div class="is-item-text">
                <xsl:value-of select="itemText"/>
            </div>
            <xsl:apply-templates select="*"/>
        </div>
   </xsl:template>

    <xsl:template match="progress">
        <div>
            <xsl:attribute name="class"><xsl:text>item-progress </xsl:text><xsl:value-of select="lower-case(replace(partytype, ' ', '-'))"/></xsl:attribute>
            <div class="item-progress-status">
                <xsl:value-of select="status"/>
            </div>
            <div class="item-progress-party">
                <xsl:value-of select="partytype"/>
            </div>
        </div>
    </xsl:template>

    <xsl:template match="links">
        <ul>
            <xsl:apply-templates select="link"/>
        </ul>
    </xsl:template>

    <xsl:template match="link">
        <xsl:variable name="setName" select="../../../@name"/>
        <li class="item-link">
            <xsl:choose>
                <xsl:when test="'{linkType}' = 'buttons' or $asButtons/link[@for=$setName] = 'true'">
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
        </li>
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
