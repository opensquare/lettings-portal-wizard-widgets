<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:output method="html"/>
    <xsl:template match="/">
        <xsl:variable name="crumbtext">
            <xsl:choose>
                <xsl:when test="'{uid}' != concat('{','uid','}')">
                    <xsl:value-of select="/response/resultSet[@entity='{uid}']/header"/>
                </xsl:when>
                <xsl:otherwise>Property Progress</xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <ol class="breadcrumb">
            <li><a href="#">Home</a></li>
            <li class="active"><xsl:value-of select="$crumbtext"/></li>
        </ol>
        <div class="row">
            <div class="col-sm-3">Property Details</div>
            <div class="col-sm-3">Tenancy</div>
            <div class="col-sm-2">Product</div>
            <div class="col-sm-2">Upload To Rightmove</div>
            <div class="col-sm-2">Review</div>
        </div>
        <xsl:choose>
            <!-- display single property -->
            <xsl:when test="'{uid}' != concat('{','uid','}')">
                <xsl:variable name="uid" select="'{uid}'"/>
                <div class="row single">
                    <div class="widget col-sm-3" name="portal-panel">
                        <xsl:attribute name="params">uids=<xsl:value-of select="$uid"/>&amp;show=prop-comp</xsl:attribute>
                    </div>
                    <div class="widget col-sm-3" name="portal-panel">
                        <xsl:attribute name="params">uids=<xsl:value-of select="$uid"/>&amp;show=ten-comp</xsl:attribute>
                    </div>
                    <div class="widget col-sm-2" name="portal-panel">
                        <xsl:attribute name="params">uids=<xsl:value-of select="$uid"/>&amp;show=product&amp;linkType=buttons</xsl:attribute>
                    </div>
                    <div class="widget col-sm-2" name="portal-panel">
                        <xsl:attribute name="params">uids=<xsl:value-of select="$uid"/>&amp;show=action</xsl:attribute>
                    </div>
                    <div class="widget col-sm-2" name="portal-panel">
                        <xsl:attribute name="params">uids=<xsl:value-of select="$uid"/>&amp;show=review</xsl:attribute>
                    </div>
                </div>
            </xsl:when>

            <!-- display all properties -->

            <!-- as widget per column -->
            <xsl:when test="'{show}' = 'columns'">
                <xsl:variable name="uids" select="string-join(/response/uids/uid, ',')"/>
                <div class="row cols">
                    <div class="widget col-sm-3" name="portal-panel" data-channel-publish="manage-property-list">
                        <xsl:attribute name="params">uids=<xsl:value-of select="$uids"/>&amp;show=prop-comp</xsl:attribute>
                    </div>
                    <div class="widget col-sm-3" name="portal-panel" params="show=ten-comp" data-channel-listen="manage-property-list" delayload="true"></div>
                    <div class="widget col-sm-2" name="portal-panel" params="show=product&amp;linkType=buttons" data-channel-listen="manage-property-list" delayload="true"></div>
                    <div class="widget col-sm-2" name="portal-panel" params="show=action" data-channel-listen="manage-property-list" delayload="true"></div>
                    <div class="widget col-sm-2" name="portal-panel" params="show=review" data-channel-listen="manage-property-list" delayload="true"></div>
                </div>
            </xsl:when>

            <!-- as widget per row -->
            <xsl:when test="'{show}' = 'rows'">
                <div class="rows">
                    <xsl:for-each select="/response/uids/uid">
                        <div class="widget" name="portal-panel" data-channel-publish="panel-rows">
                            <xsl:attribute name="params">
                                <xsl:text>uids=</xsl:text>
                                <xsl:value-of select="."/>
                                <xsl:text>&amp;show=prop-comp,ten-comp,product,action,review&amp;asButtons=product</xsl:text>
                            </xsl:attribute>
                        </div>
                    </xsl:for-each>
                </div>
            </xsl:when>

            <!-- as widget per 'cell' -->
            <xsl:when test="'{show}' = 'single'">
                <xsl:for-each select="/response/uids/uid">
                    <xsl:variable name="channel" select="concat('manage-property-list-', position())"/>
                    <div class="row singles">
                        <div class="widget col-sm-3" name="portal-panel" data-channel-publish="manage-property-list">
                            <xsl:attribute name="params">uids=<xsl:value-of select="."/>&amp;show=prop-comp</xsl:attribute>
                            <xsl:attribute name="data-channel-publish"><xsl:value-of select="$channel"/></xsl:attribute>
                        </div>
                        <div class="widget col-sm-3" name="portal-panel" params="show=ten-comp" delayload="true">
                            <xsl:attribute name="data-channel-listen"><xsl:value-of select="$channel"/></xsl:attribute>
                        </div>
                        <div class="widget col-sm-2" name="portal-panel" params="show=product&amp;linkType=buttons" delayload="true">
                            <xsl:attribute name="data-channel-listen"><xsl:value-of select="$channel"/></xsl:attribute>
                        </div>
                        <div class="widget col-sm-2" name="portal-panel" params="show=action" delayload="true">
                            <xsl:attribute name="data-channel-listen"><xsl:value-of select="$channel"/></xsl:attribute>
                        </div>
                        <div class="widget col-sm-2" name="portal-panel" params="show=review" delayload="true">
                            <xsl:attribute name="data-channel-listen"><xsl:value-of select="$channel"/></xsl:attribute>
                        </div>
                    </div>
                </xsl:for-each>
            </xsl:when>

            <xsl:otherwise>Unrecognised display action</xsl:otherwise>
        </xsl:choose>
    </xsl:template>

   

    
</xsl:stylesheet>
