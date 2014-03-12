<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:output method="html"/>
    <xsl:template match="/">
        <ol class="breadcrumb">
            <li><a href="#">Home</a></li>
            <li class="active"><xsl:value-of select="/response/address"/></li>
        </ol>
        <div class="row">
            <div class="widget col-sm-3" name="portal-panel" params="set=property&amp;displayType=links&amp;esb.action=manage-{uid}"></div>
            <div class="widget col-sm-3" name="portal-panel" params="set=tenancy&amp;displayType=links&amp;esb.action=manage-{uid}"></div>
            <div class="widget col-sm-2" name="portal-panel" params="set=product&amp;displayType=links&amp;esb.action=manage-{uid}"></div>
            <div class="widget col-sm-2" name="portal-panel" params="set=status&amp;displayType=links&amp;esb.action=manage-{uid}"></div>
            <div class="col-sm-2 review">
                <div class="ic-heading"><a href="#property-overview?property={uid}">Review</a></div>
            </div>
        </div>
    </xsl:template>

   

    
</xsl:stylesheet>
