<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:output method="html"/>
    
    <xsl:template match="PropertySummary">
        
        <div class="property clearfix">
            <xsl:variable name="propertyImage" select="PropertyThumb"/>
            <xsl:variable name="landlordProgress" select="Progress/LandlordCompletion"/>
            <xsl:variable name="tenantProgress" select="Progress/TenantCompletion"/>
            <xsl:variable name="guarantorProgress" select="Progress/GuarantorCompletion"/>

            <xsl:choose>
                <xsl:when test="$propertyImage!=''">
                    <img>
                        <xsl:attribute name="src"><xsl:value-of select="$propertyImage"/></xsl:attribute>
                    </img>
                </xsl:when>
                <xsl:otherwise>
                    <img src="http://placehold.it/600x400&amp;text=No Image Yet"/>
                </xsl:otherwise>
            </xsl:choose>

            <h4><xsl:value-of select="Description" /></h4>

            <div class="property-actions">
                <ul>
                    <li>
                        <a href="#">
                            <xsl:value-of select="Progress/NextPropertyStep"/>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <!-- construct URL using property step and property id -->
                            <xsl:value-of select="Progress/NextTenancyStep"/>
                        </a>
                    </li>
                    <li><a href="#">Manage properties</a></li>
                </ul>
            </div>

            <div class="property-progress">

                <!-- landlord progress percentage -->
                <xsl:choose>
                    <xsl:when test="$landlordProgress!=''">

                        <div class="landlord">
                            <span><xsl:value-of select="$landlordProgress"/>%</span>
                            <h5>Landlord</h5>
                        </div>
                        
                    </xsl:when>
                    <xsl:otherwise>
                        
                    </xsl:otherwise>
                </xsl:choose>

                <!-- tennant progress percentage -->
                <xsl:choose>
                    <xsl:when test="$tenantProgress!=''">

                        <div class="tenant">
                            <span><xsl:value-of select="$tenantProgress"/>%</span>
                            <h5>Tenant</h5>
                        </div>
                        
                    </xsl:when>
                    <xsl:otherwise>
                        
                    </xsl:otherwise>
                </xsl:choose>
                
                <!-- guarantor progress percentage -->
                <xsl:choose>
                    <xsl:when test="$guarantorProgress!=''">

                        <div class="guarantor">
                            <span><xsl:value-of select="$guarantorProgress"/>%</span>
                            <h5>Guarantor</h5>
                        </div>
                        
                    </xsl:when>
                    <xsl:otherwise>
                        
                    </xsl:otherwise>
                </xsl:choose>

            </div>

        </div>

    </xsl:template>

    <xsl:template name="PropertySummary">
        <h1>TEST</h1>
            
    </xsl:template>


    <!-- <xsl:template match="node()|text()"></xsl:template> -->
</xsl:stylesheet>
