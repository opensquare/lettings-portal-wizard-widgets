<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:output method="html"/>
    <xsl:variable name="step" select="concat('{', 'step', '}')"/>
    
    <xsl:template match="/">
        <xsl:apply-templates select="response/entity[@type='main']"/>
        <div class="portal-steps">
            <xsl:choose>
                <xsl:when test="response/entity[@type='step']">
                    <ul class="steps">
                        <xsl:apply-templates select="response/entity[@type='step']"/>
                    </ul>
                </xsl:when>
                <xsl:otherwise>
                    <ul class="steps clearfix">
                        <li>No actions available</li>
                    </ul>
                </xsl:otherwise>
            </xsl:choose>
        </div>
        <div class="step-content">
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
        <xsl:variable name="stepclass" select="concat('step-', step)"/>
        <xsl:variable name="active">
            <xsl:choose>
                <xsl:when test="step = '{step}'">active</xsl:when>
                <xsl:when test="@active!='' and $step = '{step}'">active</xsl:when>
            </xsl:choose>
        </xsl:variable>
    	<li>
    		<xsl:attribute name="class">
    			<xsl:value-of select="status"/>
                <xsl:text> </xsl:text>
                <xsl:value-of select="$stepclass"/>
                <xsl:text> </xsl:text>
                <xsl:if test="$active = 'active'">active</xsl:if>
    		</xsl:attribute>

    		<a class="step-link">
                <xsl:attribute name="href">
                    <xsl:value-of select="widget"/>
                    <xsl:text>?</xsl:text>
                    <xsl:value-of select="replace(widgetParams, '&amp;', '%26')"/>
                </xsl:attribute>
                <xsl:attribute name="data-step"><xsl:value-of select="step"/></xsl:attribute>
				<h3 class="step-desc"><xsl:value-of select="title"/></h3>
				<p>
                    <xsl:value-of select="description"/>
                </p>
				<h4>Step <xsl:value-of select="step"/></h4>
			</a>

    	</li>
    </xsl:template>

    <xsl:template match="entity[@type='main']">
        <ol class="breadcrumb">
            <li><a href="#">Home</a></li>
            <li>
                <a>
                    <xsl:attribute name="href">#<xsl:value-of select="target"/></xsl:attribute>
                    <xsl:value-of select="description"/>
                    <xsl:text> (</xsl:text>
                    <xsl:value-of select="completed"/> of <xsl:value-of select="total"/> steps complete)
                </a>
            </li>
            <li class="active">{pageDescription}</li>
        </ol>
    </xsl:template>

</xsl:stylesheet>