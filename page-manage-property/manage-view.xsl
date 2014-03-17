<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:output method="html"/>
    <xsl:template match="/">
        <ol class="breadcrumb">
            <li><a href="#">Home</a></li>
            <li class="active"><xsl:value-of select="/response/address"/></li>
        </ol>
        <div class="row">
            <div class="widget col-sm-3" name="portal-panel">
                <xsl:attribute name="params">uids=<xsl:value-of select="/response/uids/property"/>&amp;show=progressoptions&amp;esb.action=manage-{uid}</xsl:attribute>
            </div>
            <div class="widget col-sm-3" name="portal-panel">
                <xsl:attribute name="params">uids=<xsl:value-of select="/response/uids/tenancy"/>&amp;show=progressoptions&amp;esb.action=manage-{uid}</xsl:attribute>
            </div>
            <div class="widget col-sm-2" name="portal-panel">
                <xsl:attribute name="params">uids=<xsl:value-of select="/response/uids/product"/>&amp;show=progressoptions&amp;linkType=buttons&amp;esb.action=manage-{uid}</xsl:attribute>
            </div>
            <div class="widget col-sm-2" name="portal-panel">
                <xsl:attribute name="params">uids=<xsl:value-of select="/response/uids/status"/>&amp;show=nextAction&amp;esb.action=manage-{uid}</xsl:attribute>
            </div>
            <div class="col-sm-2 review">
                <div class="ic-heading"><a href="#property-overview?property={uid}">Review</a></div>
            </div>
        </div>
    </xsl:template>

   

    
</xsl:stylesheet>
