<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:output method="html"/>
    <xsl:template match="/">
		<div class="container-fluid">
			<div class="row">
				<div class="col-sm-2">
					<h2>My Details</h2>
					<div class="widget about" name="portal-panel"> 
						<xsl:attribute name="params">uids=about&amp;show=summary&amp;esb.action=tile-data</xsl:attribute>
					</div>
				</div>
				<div class="col-sm-10">
					<h2>My Properties</h2>
					<xsl:for-each select="/response/uids/uid">
						<div class="widget clearfix" name="portal-panel" data-channel-publish="panel-rows">
							<xsl:attribute name="params">
								<xsl:text>uids=</xsl:text><xsl:value-of select="."/><xsl:text>&amp;show=summary&amp;header=true</xsl:text>
							</xsl:attribute>

						</div>
					</xsl:for-each>
				</div>
			</div>
		</div><!-- /.container-fluid -->
	</xsl:template>
</xsl:stylesheet>