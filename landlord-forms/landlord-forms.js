function Widget_landlord_forms() {
  
  this.onReadyExtend = function() {
    
    var initialData = '<property></property>';
    
    rf.loadFlow('widgets/landlord-forms/landlord-forms-flow.js', $('.rhinoforms-landlord-formContainer', this.$widgetDiv));

  } 
}