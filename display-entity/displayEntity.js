function Widget_display_entity(){
    
    this.initExtend = function() {
        if (!pw.defined(this.parameterMap.depth)){
            this.parameterMap.depth = 99;
        }
    }
    this.onReadyExtend = function(){
       
    }
}