function Widget_tennant_forms() {
  
  this.onReadyExtend = function() {
    
    var initialData = '<property></property>';
    
    rf.loadFlow('widgets/tennant-forms/tennant-forms-flow.js', $('.rhinoforms-tennant-formContainer', this.$widgetDiv));

  } 
}