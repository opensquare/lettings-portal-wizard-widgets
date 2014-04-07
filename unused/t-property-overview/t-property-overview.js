function Widget_t_property_overview() {

	var channelSetPageTitles = 't-portal.setPageTitles',
		channelToggleActions = 'toggleActions'
	;

	var widget = this,
	propertyTpl = '<div class="widget panel panel-default" name="property-summary">widget to load</div>',
	emptyPortfolioTemplate = '<div class="widget" name="blank-portfolio"></div>',
	pageId,
	args;
	

	this.onReadyExtend = function() {
		args = this.$widgetDiv.attr('page.args');
		pageId = this.$widgetDiv.attr('pageid');

		this.loadCurrentProperty();

	}

	this.loadCurrentProperty = function() {
		$.ajax({
			url: 'widgets/t-property-details/tenancy.json',
			dataType: 'json',
		})
		.done(function(data) {

			var contentArea = document.getElementById('current-property');

			contentArea.innerHTML = 	
				'<table class="table table-striped">' +
					'<thead>' +
						'<tr>' +
							'<td colspan=\'2\'>' + data.tenancy.address.addressLine1 + ', ' + data.tenancy.address.town + ', ' + data.tenancy.address.postcode + ', ' + '</td>' +
						'</tr>' +
					'</thead>' +
					'<tbody>' +
						'<tr>' +
							'<td>Duration</td><td>' + data.tenancy.tenancy_duration.length + ' Months</td>' +
						'</tr>' +
						'<tr>' +
							'<td>Start Date</td><td>' + data.tenancy.tenancy_duration.start_date + '</td>' +
						'</tr>' +
						'<tr>' +
							'<td>End Date</td><td>' + data.tenancy.tenancy_duration.end_date + '</td>' +
						'</tr>' +
						'<tr>' +
							'<td>Landlord</td><td>' + data.tenancy.landlord + '</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>';

		})
		.fail(function(object, status, error){
			console.debug('error: ' + status + ' msg: ' + error);
		});
	}

}