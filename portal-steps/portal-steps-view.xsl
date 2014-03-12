<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:output method="html"/>
    
    <xsl:template match="/">
    	<div class="portal-steps">
    		<xsl:choose>
                <xsl:when test="response/entity[@type='step']">
                    <xsl:apply-templates select="response/entity[@type='main']"/>
                	<ul class="steps clearfix">
                        <xsl:call-template name="backstep"/>
                    	<xsl:apply-templates select="response/entity[@type='step']"/>
                    </ul>
                </xsl:when>
                <xsl:otherwise>
                    <ul class="steps clearfix">
                        <xsl:call-template name="backstep"/>
                        <li>No actions available</li>
                	</ul>
                </xsl:otherwise>
            </xsl:choose>
    	</div>
    	<div class="step-content">
            <xsl:variable name="step" select="concat('{', 'step', '}')"/>
            <xsl:choose>
                <xsl:when test="'{step}' != $step and not(empty(//entity[step='{step}']))">
                    <xsl:call-template name="stepContent">
                        <xsl:with-param name="step" select="//entity[step='{step}']"/>
                    </xsl:call-template>
                </xsl:when>
                <xsl:when test="response/entity[@active='active']">
                    <xsl:call-template name="stepContent"/>
                </xsl:when>
            </xsl:choose>
    	</div>
    </xsl:template>

    <xsl:template name="stepContent">
        <xsl:param name="step" select="/response/entity[@active='active']"/>
        <div class="widget" name="display-step">
            <xsl:attribute name="params">
                <xsl:text>activeStep=</xsl:text>
                <xsl:value-of select="$step/widget"/>
                <xsl:text>&amp;entity=</xsl:text>
                <xsl:value-of select="'{entity}'"/>
                <xsl:text>&amp;stepParams=</xsl:text>
                <xsl:if test="$step/widgetParams">
                    <!-- need to encode parameter string so it acts as a single parameter -->
                    <xsl:value-of select="replace($step/widgetParams, '&amp;', '%26')"/>
                </xsl:if>
            </xsl:attribute>
        </div>
    </xsl:template>

    <xsl:template match="entity[@type='step']">
    	<li>
    		<xsl:attribute name="class">
    			<xsl:value-of select="status"/>
                <xsl:text> step-</xsl:text>
                <xsl:value-of select="step"/>
                <xsl:text> </xsl:text>
                <xsl:value-of select="@active"/>
    		</xsl:attribute>

    		<a class="step-link">
                <xsl:attribute name="href">
                    <xsl:value-of select="widget"/>
                    <xsl:text>?</xsl:text>
                    <xsl:value-of select="replace(widgetParams, '&amp;', '%26')"/>
                </xsl:attribute>
				<h3><xsl:value-of select="title"/></h3>
				<p><xsl:value-of select="description"/></p>
				<h4>Step <xsl:value-of select="step"/></h4>
			</a>

    	</li>
    </xsl:template>

    <xsl:template match="entity[@type='main']">
        <h2>
            <xsl:value-of select="description"/>
            <xsl:value-of select="' '"/>
            <small>
                <xsl:value-of select="completed"/> of <xsl:value-of select="total"/> steps complete
            </small>
        </h2>
    </xsl:template>

    <xsl:template name="backstep">
        <li class="step-back">
            <a href="#">
                <h3><xsl:text> </xsl:text></h3>
                <p>Back to properties</p>
                <h4></h4>
            </a>
        </li>
    </xsl:template>

</xsl:stylesheet>