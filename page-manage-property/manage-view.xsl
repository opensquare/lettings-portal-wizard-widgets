<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:output method="xml"/>
    <xsl:template match="/">
        <manage>
            <propertyId><xsl:value-of select="//PropertyId"/></propertyId>
            <breadCrumb><xsl:value-of select="ManagePropertyResponse/Description"/></breadCrumb>
            <xsl:apply-templates select="ManagePropertyResponse//Progress"/>
            <xsl:apply-templates select="ManagePropertyResponse//Product"/>
            <xsl:apply-templates select="ManagePropertyResponse//Advertisement"/>
        </manage>
    </xsl:template>

    <!-- Property and Tenancy columns -->
    <xsl:template match="Progress">
        <progressStatus>
            <heading><xsl:value-of select="Description"/></heading>
            <completed><xsl:value-of select="StepsComplete"/></completed>
            <total><xsl:value-of select="StepsTotal"/></total>
            <next>
                <xsl:if test="NextIncompleteStep !=''">
                    <xsl:text>&amp;step=</xsl:text><xsl:value-of select="NextIncompleteStep"/>
                </xsl:if>
            </next>
            <widget><xsl:value-of select="translate(lower-case(Type), ' ','-')"/>-progress</widget>
        </progressStatus>
    </xsl:template>

    <!-- Product Column -->
    <xsl:template match="Product">
        <product>
            <xsl:choose>
                <xsl:when test="Name != ''">
                    <name><xsl:value-of select="Name"/></name>
                    <link>
                        <text>View Details</text>
                        <widget>product-summary</widget>
                    </link>
                <xsl:if test="UpgradeTo != ''">
                    <link>
                        <text>Upgrade to <xsl:value-of select="UpgradeTo"/></text>
                        <widget>product-upgrade</widget>
                    </link>
                </xsl:if>
                </xsl:when>
                <xsl:otherwise>
                    <link>
                        <text>Select Product</text>
                        <widget>product-select</widget>
                    </link>
                </xsl:otherwise>
            </xsl:choose>
        </product>
    </xsl:template>

    <!-- Advertise Column -->
    <xsl:template match="Advertisement">
        <advertisement>
            <link>
                <!-- advertised? -->
                <xsl:choose>
                    <xsl:when test="Advertised = 'false'">
                        
                        <!-- Eligible to advertise? -->
                        <xsl:choose>
                            <xsl:when test="Eligible='true'">
                                <text>Upload Now</text>
                                <widget>advertise-property</widget> 
                            </xsl:when>

                            <!-- option to fasttrack -->
                            <xsl:otherwise>
                                <xsl:variable name="link">
                                    <!-- property or tenancy? -->
                                    <xsl:choose>
                                        <xsl:when test="//Progress[type='Property']/StepsComplete = //Progress[type='Property']/StepsTotal">
                                            <widget>tenancy-progress</widget>
                                            <next>&amp;step=<xsl:value-of select="//Progress[type='Tenancy']/NextIncompleteStep"/></next>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <widget>property-progress</widget>
                                            <next>&amp;step=<xsl:value-of select="//Progress[type='Property']/NextIncompleteStep"/></next>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </xsl:variable>
                                
                                <text>Fast track to Rightmove</text>
                                <widget><xsl:value-of select="$link/widget"/></widget>
                                <next><xsl:value-of select="$link/next"/></next>
                            </xsl:otherwise>
                        </xsl:choose>

                    </xsl:when>

                    <!-- advertised -->
                    <xsl:otherwise>
                        <!-- Any Tenant activity? -->
                        <xsl:choose>
                            <xsl:when test="TenantStatus='interest'">
                                <text>New interest has been shown</text>
                            </xsl:when>
                            <xsl:when test="TenantStatus='proceeding'">
                                <text>Proceeding with Tenant</text>
                            </xsl:when>
                            <xsl:when test="TenantStatus='agreed'">
                                <text>Tenancy is underway</text>
                            </xsl:when>
                            <xsl:otherwise>
                                <text>Property is advertised</text>
                            </xsl:otherwise>
                        </xsl:choose>
                        <widget></widget>
                    </xsl:otherwise>
                </xsl:choose>
            </link>
        </advertisement>
    </xsl:template>
</xsl:stylesheet>