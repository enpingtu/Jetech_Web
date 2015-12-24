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
    
    fixTopSellerFirstList();
    fixSearchResultList();
   // setGoogleAdwordsParameters();
};

fixTopSellerFirstList = function(){
	if($('.topSellerUL li').first().length===1){
		var prodImageDiv = $('.topSellerUL li').first().children("div.ProductImage");
		var prodDetailDiv = $('.topSellerUL li').first().children("div.ProductDetails");
		var price = $('.topSellerUL li').first().children(".p-price");
		var rating = $('.topSellerUL li').first().children("div.ProductPriceRating");
		var addBtn = $('.topSellerUL li').first().children("div.ProductActionAdd");
		addBtn.removeClass();
		addBtn.addClass("addToCartBtnBox");
		addBtn.children().removeClass();
		
		$('.topSellerUL li').first().empty();
		prodDetailDiv.append(price);
		var detailHeight = $([$('.topSellerUL li')[1]]).children("div.ProductDetails").css("min-height");
		prodDetailDiv.css("min-height", detailHeight);
		
		
		$('.topSellerUL li').first().addClass("myProductLi");
		
		$('.topSellerUL li').first().append(prodImageDiv);
		$('.topSellerUL li').first().append(rating);
		$('.topSellerUL li').first().append(prodDetailDiv);
		$('.topSellerUL li').first().append($('<div/>').html('<div class="Value AvailabilityInDetail" style="margin-top:10px;margin-bottom:15px;">ln stock, free shipping</div>'));
		$('.topSellerUL li').first().append(addBtn);
	}
};

fixSearchResultList = function(){
	if($('#SearchProduct_Container #SearchResultsProduct ul.ProductList').length>0){
	
	
		$('#SearchProduct_Container #SearchResultsProduct ul.ProductList').children("li").each(
			function(index){
				var liObj = $('#SearchProduct_Container #SearchResultsProduct ul.ProductList').children("li").get(index);
				var prodImageDiv = $(liObj).children("div.ProductImage");
				var prodDetailDiv = $(liObj).children("div.ProductDetails");
				var rating = $(liObj).children("div.ProductPriceRating");
				var price = rating.children(".p-price").remove();
				
				var addBtn = $(liObj).children("div.ProductActionAdd");
				addBtn.removeClass();
				addBtn.addClass("addToCartBtnBox");
				addBtn.children().removeClass();
				
				$(liObj).empty();
				prodDetailDiv.append(price);
				
				$(liObj).addClass("myProductLi");
				
				$(liObj).append(prodImageDiv);
				$(liObj).append(rating);
				$(liObj).append(prodDetailDiv);
				$(liObj).append($('<div/>').html('<div class="Value AvailabilityInDetail" style="margin-top:10px;margin-bottom:15px;">ln stock, free shipping</div>'));
				$(liObj).append(addBtn);
				});
	}
};

setGoogleAdwordsParameters = function(){
	// product page
	if($('.goog_prod_product_id').length>0){
		google_tag_params.ecomm_prodid = parseInt($('.goog_prod_product_id').val());
		google_tag_params.ecomm_pagetype = 'product';
		google_tag_params.ecomm_totalvalue = parseCurrency($('.goog_prod_product_price').text());
	}else if($('.goog_cart_product_id').length>0){
		var cartProducts = $('.goog_cart_product_id');
		google_tag_params.ecomm_prodid = [];
		cartProducts.each(function(elm){
			var prodId = $(cartProducts.get(elm)).text();
			google_tag_params.ecomm_prodid.push(parseInt(prodId));
		});
		google_tag_params.ecomm_pagetype = 'cart';
		google_tag_params.ecomm_totalvalue = parseCurrency($('.goog_cart_price').text());
	}

};

parseCurrency = function(currency){
	return Number(currency.replace(/[^0-9\.]+/g,""));
};