<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:output method="html"/>
    
    <xsl:template match="/">
    	<div class="portal-steps">
    		<xsl:choose>
                <xsl:when test="response/entity">
                	<ul class="steps">
                    	<xsl:apply-templates select="response/entity"/>
                	</ul>
                </xsl:when>
                <xsl:otherwise>
                    No actions available
                </xsl:otherwise>
            </xsl:choose>
    	</div>
    	<div class="step-content">

    		<xsl:if test="response/entity[@active='active']">
		     
    			<xsl:value-of select="response/entity[@active='active']/widget"/>

			</xsl:if>

    		<!-- <xsl:apply-templates match="response/entity[active='true']"/> -->

    	</div>
    </xsl:template>

    <xsl:template match="entity">
    	<li>
    		<xsl:attribute name="class">
    			<!-- if 'active' set selected class attribute -->
    			<xsl:value-of select="@active"/><xsl:text> </xsl:text><xsl:value-of select="status"/>
    		</xsl:attribute>

    		<a href="#path/to/widget?">
				<h3><xsl:value-of select="title"/></h3>
				<p><xsl:value-of select="description"/></p>
				<h4>Step <xsl:value-of select="step"/></h4>
			</a>

    	</li>
    </xsl:template>

    <!-- <xsl:template match="book[featured='yes']"> -->
    

</xsl:stylesheet>