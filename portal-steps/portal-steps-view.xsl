<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:output method="html"/>
    <xsl:variable name="step" select="concat('{', 'step', '}')"/>
    <xsl:variable name="activeStepNo">
        <xsl:choose>
            <xsl:when test="$step != '{step}' and not(empty(//entity[step='{step}']))">
                <!-- specific step -->
                <xsl:value-of select="'{step}'"/>
            </xsl:when>
            <xsl:when test="count(//entity[status='incomplete']) &gt; 0">
                <!-- first incomplete step -->
                <xsl:value-of select="//entity[status='incomplete'][1]/step"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="//entity[status='optional'][1]/step"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:variable>
    
    <xsl:template match="/">
        <xsl:apply-templates select="response/entity[@type='main']"/>
        <div class="portal-steps">
            <xsl:choose>
                <xsl:when test="response/entity[@type='step']">
                    <ol class="steps">
                        <xsl:apply-templates select="response/entity[@type='step']"/>
                    </ol>
                </xsl:when>
                <xsl:otherwise>
                    <ol class="steps clearfix">
                        <li>No actions available</li>
                    </ol>
                </xsl:otherwise>
            </xsl:choose>
        </div>
        <div class="step-content">
            <div class="widget" name="display-step">
                <xsl:attribute name="params">
                    <xsl:text>activeStep=</xsl:text>
                    <xsl:value-of select="//entity[step=$activeStepNo]/widget"/>
                    <xsl:text>&amp;entity=</xsl:text>
                    <xsl:value-of select="'{entity}'"/>
                    <xsl:text>&amp;stepParams=</xsl:text>
                    <xsl:if test="//entity[step=$activeStepNo]/widgetParams">
                        <!-- need to encode parameter string so it acts as a single parameter -->
                        <xsl:value-of select="replace(//entity[step=$activeStepNo]/widgetParams, '&amp;', '%26')"/>
                    </xsl:if>
                </xsl:attribute>
            </div>
        </div>
    </xsl:template>

    <xsl:template match="entity[@type='step']">
        <xsl:variable name="stepclass" select="concat('step-', step)"/>
        <xsl:variable name="active" select="step = $activeStepNo"/>
    	<li>
    		<xsl:attribute name="class">
    			<xsl:value-of select="status"/>
                <xsl:text> </xsl:text>
                <xsl:value-of select="$stepclass"/>
                <xsl:if test="$active = true()"><xsl:text> active</xsl:text></xsl:if>
    		</xsl:attribute>

    		<a class="step-link">
                <xsl:attribute name="href">
                    <xsl:value-of select="widget"/>
                    <xsl:text>?</xsl:text>
                    <xsl:value-of select="replace(widgetParams, '&amp;', '%26')"/>
                </xsl:attribute>
                <xsl:attribute name="data-step"><xsl:value-of select="step"/></xsl:attribute>
                <xsl:if test="disabled='true'">
                    <xsl:attribute name="data-disabled">true</xsl:attribute>
                </xsl:if>
                <xsl:variable name="status" select="status" />

                <xsl:choose>
                    <xsl:when test="$status = 'complete'">
                        <span class="glyphicon glyphicon-ok"></span>&#160;
                    </xsl:when>
                    <xsl:when test="$status = 'incomplete'">
                        <span class="glyphicon glyphicon-remove"></span>&#160;
                    </xsl:when>
                </xsl:choose>

				<xsl:value-of select="title"/>
				<!-- <p>
                    <xsl:value-of select="description"/>
                </p>
				<h4>Step <xsl:value-of select="step"/></h4> -->
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