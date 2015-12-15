initPageMenu = function(){
	$('.PageMenu .expandable-hitarea').hide();
    $('.PageMenu .collapsable-hitarea').hide();    
    $('.PageMenu ul.sf-horizontal').addClass('sf-menu');
    $('.PageMenu ul.sf-menu').superfish();
    
    $('#shopByCategory').mouseover = function(){
    	if($('#categoryMenu').css('display') === 'none'){
    		$('#categoryMenu').css('display', 'block');
    	}else{
    		$('#categoryMenu').css('display', 'none');
    	}
    };
};

