function Widget_property_forms() {
  
  this.onReadyExtend = function() {
    
    var initialData = '<property></property>';
    
    rf.loadFlow('widgets/property-forms/property-forms-flow.js', $('.rhinoforms-property-formContainer', this.$widgetDiv));

  } 
}