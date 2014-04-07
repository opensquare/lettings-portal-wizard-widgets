function Widget_tenant_forms() {
  
  this.onReadyExtend = function() {
    
    var initialData = '<property></property>';
    
    rf.loadFlow('widgets/tenant-forms/tenant-forms-flow.js', $('.rhinoforms-tenant-formContainer', this.$widgetDiv));

  } 
}