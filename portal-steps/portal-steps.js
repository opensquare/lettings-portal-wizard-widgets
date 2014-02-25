function Widget_portal_steps(){

	this.onReadyExtend = function() {

        // count number of steps 
        var countChildElem = document.getElementsByClassName('steps')[0].childElementCount;

        // divide window width with number of steps
        var windowWidth = window.innerWidth;

        // make each li width window width divided by number of steps
        $('.steps li').css('width', windowWidth/countChildElem + 'px');

        // add tick to completed steps
        $('.steps li.complete h3').prepend('<span class="glyphicon glyphicon-ok"></span> ');

        // add cross to incomplete steps
        $('.steps li.incomplete h3').prepend('<span class="glyphicon glyphicon-remove"></span> ');

    }

}