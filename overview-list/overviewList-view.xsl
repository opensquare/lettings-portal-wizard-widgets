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
        <xsl:choose>
            <xsl:when test="message/widget">
                <div class="panel panel-default row">
                    <div class="panel-body">
                        <xsl:call-template name="displayRow">
                            <xsl:with-param name="entity" select="."/>
                            <xsl:with-param name="pos" select="position()"/>
                        </xsl:call-template>
                    </div>
                    <div class="panel-footer">
                        <xsl:apply-templates select="message"/>
                    </div>
                </div>
            </xsl:when>
            <xsl:otherwise>
                <xsl:call-template name="displayRow">
                    <xsl:with-param name="entity" select="."/>
                    <xsl:with-param name="pos" select="position()"/>
                </xsl:call-template>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="displayRow">
        <xsl:param name="entity"/>
        <xsl:param name="pos"/>
        <xsl:variable name="collapseId" select="concat('collapse-', $pos)"/>
        <div class="row">
            <xsl:attribute name="data-type"><xsl:value-of select="$entity/@type"/></xsl:attribute>
            <div class="col-sm-4 main">
                <h4>
                    <a data-toggle="collapse" data-parent="#accordion">
                        <xsl:attribute name="href"><xsl:value-of select="concat('#',$collapseId)"/></xsl:attribute>
                        <xsl:value-of select="$entity/description"/>
                    </a>
                </h4>
                <p>
                    <span><xsl:value-of select="concat($entity/status, ' - ')"/></span>
                    <xsl:call-template name="entityLink">
                        <xsl:with-param name="type" select="$entity/@type"/>
                        <xsl:with-param name="completed" select="$entity/completed"/>
                        <xsl:with-param name="total" select="$entity/total"/>
                        <xsl:with-param name="widget" select="$entity/widget"/>
                        <xsl:with-param name="uid" select="$entity/@uid"/>
                    </xsl:call-template>
                </p>
            </div>
            <div class="panel-collapse collapse">
                <xsl:attribute name="id"><xsl:value-of select="$collapseId"/></xsl:attribute>
                <div class="col-sm-4">
                    <h5 style="margin:0">
                        <xsl:value-of select="$entity/entity/description"/>
                    </h5>
                    <p>
                        <span><xsl:value-of select="concat($entity/entity/status, ' - ')"/></span>
                        <xsl:call-template name="entityLink">
                            <xsl:with-param name="type" select="$entity/entity/@type"/>
                            <xsl:with-param name="completed" select="$entity/entity/completed"/>
                            <xsl:with-param name="total" select="$entity/entity/total"/>
                            <xsl:with-param name="widget" select="$entity/entity/widget"/>
                            <xsl:with-param name="uid" select="$entity/entity/@uid"/>
                        </xsl:call-template>
                    </p>
                </div>
                <div class="col-sm-4">
                    <xsl:apply-templates select="$entity/action"/>
                </div>
            </div>
        </div>
    </xsl:template>

    <xsl:template match="action">
        <xsl:choose>
            <xsl:when test="widget">
                <p><a class="btn btn-default">
                    <xsl:attribute name="href">
                        <xsl:value-of select="concat('#', widget)"/>
                    </xsl:attribute>
                    <xsl:attribute name="data-action"><xsl:value-of select="widget"/></xsl:attribute>
                    <xsl:value-of select="description"/>
                </a></p>
            </xsl:when>
            <xsl:otherwise></xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="message">
        <h4>Message: 
            <a><xsl:attribute name="href">#<xsl:value-of select="widget"/></xsl:attribute>
                <xsl:value-of select="description"/>
            </a>
        </h4>
    </xsl:template>

    <xsl:template name="entityLink">
        <xsl:param name="type"/>
        <xsl:param name="completed"/>
        <xsl:param name="total"/>
        <xsl:param name="widget"/>
        <xsl:param name="uid"/>
        <a>
            <xsl:attribute name="href">
                <xsl:call-template name="widgetHref">
                    <xsl:with-param name="widget" select="$widget"/>
                    <xsl:with-param name="type" select="$type"/>
                    <xsl:with-param name="uid" select="$uid"/>
                </xsl:call-template>
            </xsl:attribute>
            <strong>
                <xsl:choose>
                    <xsl:when test="$completed!=$total">
                        <xsl:value-of select="$completed"/> of <xsl:value-of select="$total"/> steps complete
                    </xsl:when>
                    <xsl:otherwise>view</xsl:otherwise>
                </xsl:choose>
            </strong>
        </a>
    </xsl:template>

    <xsl:template name="widgetHref">
        <xsl:param name="widget"/>
        <xsl:param name="type"/>
        <xsl:param name="uid"/>
        <xsl:value-of select="concat('#', $widget, '?', $type, '=', $uid)"/>
    </xsl:template>
</xsl:stylesheet>
