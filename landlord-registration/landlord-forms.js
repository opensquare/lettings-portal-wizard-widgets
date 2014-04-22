function Widget_landlord_registration() {
  
  this.onReadyExtend = function() {
    
    var formContainer = $('.rhinoforms-landlord-formContainer', this.$widgetDiv);

    // remove when plugged in to esb
    var tempInitData = '<root><esb><username>activated@account.com</username></esb></root>';

    if(queryURL()['a'] == 'true' && queryURL['u'] != ''){
        rf.loadFlow('widgets/' + this.name + '/landlord-activate-flow.js', formContainer, tempInitData);
    } else {
        rf.loadFlow('widgets/' + this.name + '/landlord-forms-flow.js', formContainer);
    }
    

  }

  function queryURL() {
    var 
      result = {}, queryString = location.search.slice(1),
      re = /([^&=]+)=([^&]*)/g, 
      m
    ;

    while (m = re.exec(queryString)) {
      result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    return result;
  }
}