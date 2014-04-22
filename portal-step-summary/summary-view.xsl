<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:output method="html"/>
    
    <xsl:template match="/">
        <div class="row">
            <div class="col-sm-offset-2 col-sm-2"><h3>Next Steps:</h3></div>
            <div class="col-sm-offset-3 col-sm-2">
                <a href="#">Return to Home Page</a>
            </div>
        </div>
        <xsl:apply-templates select="response/entity[@type='step']"/>
    </xsl:template>

    <xsl:template match="entity[@type='step']">
        <div class="row">
            <div>
                <xsl:attribute name="class">
                    <xsl:text>col-sm-offset-2 col-sm-2 </xsl:text>
                    <xsl:value-of select="status"/>
                </xsl:attribute>
                <h3>
                <a class="step-link">
                    <xsl:attribute name="href">
                        <xsl:value-of select="stepName"/>
                    </xsl:attribute>

                    <xsl:attribute name="data-step"><xsl:value-of select="step"/></xsl:attribute>

                    <xsl:if test="disabled='true'">
                        <xsl:attribute name="data-disabled">true</xsl:attribute>
                    </xsl:if>

                    <xsl:choose>
                        <xsl:when test="status = 'complete'">
                            <span class="glyphicon glyphicon-ok"></span>&#160;
                        </xsl:when>
                        <xsl:when test="status = 'incomplete'">
                            <span class="glyphicon glyphicon-remove"></span>&#160;
                        </xsl:when>
                    </xsl:choose>

                    <xsl:value-of select="title"/>
                </a>
                </h3>
            </div>
            <div class="col-sm-8">
                <h3><small><xsl:value-of select="description"/></small></h3>
            </div>

        </div>
    </xsl:template>

</xsl:stylesheet>