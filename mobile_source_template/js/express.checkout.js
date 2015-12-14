
var ExpressCheckout={completedSteps:new Array(),currentStep:'AccountDetails',signedIn:0,digitalOrder:0,createAccount:0,anonymousCheckout:0,checkoutLogin:0,init:function()
{if($('#CheckoutStepAccountDetails').css('display')=='none'){ExpressCheckout.currentStep='BillingAddress';}
else{$('#BillingDetailsLabel').html(lang.ExpressCheckoutStepBillingAccountDetails);}
$('.ExpressCheckoutBlock').hover(function(){if($(this).hasClass('ExpressCheckoutBlockCompleted')){$(this).css('cursor','pointer');}},function(){$(this).css('cursor','default');});$('.ExpressCheckoutTitle').click(function(){if($(this).hasClass('ExpressCheckoutBlockCompleted')){$(this).find('.ChangeLink').click();}});$(document).ajaxError(function(event,request,settings){ExpressCheckout.HideLoadingIndicators();alert(lang.ExpressCheckoutLoadError);});},Login:function()
{$('#CheckoutLoginError').hide();ExpressCheckout.anonymousCheckout=0;ExpressCheckout.createAccount=0;if(ExpressCheckout.validateEmailAddress($('#login_email').val())==false){alert(lang.LoginEnterValidEmail);$('#login_email').focus();$('#login_email').select();return false;}
if($('#login_pass').val()==''){alert(lang.LoginEnterPassword);$('#login_pass').focus();return false;}
ExpressCheckout.ShowLoadingIndicator('#LoginForm');$.ajax({url:'remote.php',type:'post',dataType:'json',data:'w=expressCheckoutLogin&'+$('#LoginForm').serialize(),success:ExpressCheckout.HandleResponse});return false;},HandleResponse:function(response)
{ExpressCheckout.HideLoadingIndicators();if(response.completedSteps!=undefined){$.each(response.completedSteps,function(){var value=document.createTextNode(this.message);$('#CheckoutStep'+this.id+' .ExpressCheckoutCompletedContent').html(value);$('#CheckoutStep'+this.id).addClass('ExpressCheckoutBlockCompleted');ExpressCheckout.completedSteps[ExpressCheckout.completedSteps.length]=this.id;});}
if(response.stepContent!=undefined){$.each(response.stepContent,function(){$('#CheckoutStep'+this.id+' .ExpressCheckoutContent').html(this.content);$('#CheckoutStep'+this.id+' .ExpressCheckoutContent .FormField.JSHidden').show();});}
ExpressCheckout.HandleResponseStatus(response);},HandleResponseStatus:function(response)
{if(response.status==0){if(response.errorContainer){$(response.errorContainer).html(response.errorMessage).show();}
else{alert(response.errorMessage);}}
if(response.changeStep){ExpressCheckout.ChangeStep(response.changeStep);ExpressCheckout.ResetNextSteps();}
if(response.focus){try{$(response.focus).focus().select();}
catch(e){}}},GuestCheckout:function()
{$('#CreateAccountForm').show();$('#CheckoutLoginError').hide();if($('#CheckoutGuestForm').css('display')!='none'&&!$('#checkout_type_register:checked').val()){type='guest';ExpressCheckout.anonymousCheckout=1;ExpressCheckout.createAccount=0;}
else{type='account';ExpressCheckout.anonymousCheckout=0;ExpressCheckout.createAccount=1;}
ExpressCheckout.ShowLoadingIndicator('#CheckoutGuestForm');$.ajax({url:'remote.php',type:'post',dataType:'json',data:{w:'expressCheckoutGetAddressFields',type:type},success:ExpressCheckout.HandleResponse});},ResetNextSteps:function()
{steps=ExpressCheckout.GetSteps();var beginReset=false;var newCompleted=Array();$.each(steps,function(i,step){if(step==ExpressCheckout.currentStep){newCompleted[newCompleted.length]=step;beginReset=true;}
else if(beginReset==true){$('#CheckoutStep'+step).removeClass('ExpressCheckoutBlockCompleted');$('#CheckoutStep'+step+' .ExpressCheckoutCompletedContent').html('');}});ExpressCheckout.completedSteps=newCompleted;},ChangeStep:function(step)
{if(typeof(step)=='undefined'){step=ExpressCheckout.CalculateNextStep(ExpressCheckout.currentStep);}
if(step==ExpressCheckout.currentStep){return false;}
$('#CheckoutStep'+ExpressCheckout.currentStep+' .ExpressCheckoutContent').fadeOut('slow');$('#CheckoutStep'+ExpressCheckout.currentStep).addClass('ExpressCheckoutBlockCollapsed');if($.inArray(ExpressCheckout.currentStep,ExpressCheckout.completedSteps)!=-1){$('#CheckoutStep'+ExpressCheckout.currentStep).addClass('ExpressCheckoutBlockCompleted');}
$('#CheckoutStep'+step+' .ExpressCheckoutContent').fadeIn('slow',function(){var topAcc2=$(this).closest('.ExpressCheckoutBlock').offset().top;$('html, body').animate({scrollTop:topAcc2-40},600);});$('#CheckoutStep'+step).removeClass('ExpressCheckoutBlockCollapsed');ExpressCheckout.currentStep=step;return false;},GetSteps:function()
{var steps=Array();if(ExpressCheckout.signedIn==0){steps[steps.length]='AccountDetails';}
steps[steps.length]='BillingAddress';if(!ExpressCheckout.digitalOrder){steps[steps.length]='ShippingAddress';steps[steps.length]='ShippingProvider';}
steps[steps.length]='Confirmation';steps[steps.length]='PaymentDetails';return steps;},CalculateNextStep:function(currentStep){steps=ExpressCheckout.GetSteps();var nextStep='';$.each(steps,function(i,step){if(step==currentStep){nextStep=steps[i+1];}});if(nextStep){return nextStep;}},ChooseBillingAddress:function()
{if(!$('#BillingAddressTypeExisting:checked').val()||$('#ChooseBillingAddress').css('display')=='none'){if((ExpressCheckout.anonymousCheckout||ExpressCheckout.createAccount)&&!ExpressCheckout.ValidateNewAccount(true)){return false;}
if(!ExpressCheckout.ValidateNewAddress('billing')){return false;}
addressType='new';}
else if($('.SelectBillingAddress select option:selected').val()==-1){alert(lang.ExpressCheckoutChooseBilling);$('.SelectBillingAddress select').focus();return false;}
else{addressType='existing';}
createAppend='';if(ExpressCheckout.createAccount){createAppend='&createAccount=1';}
$('noscript').remove();$.ajax({url:'remote.php',type:'post',dataType:'json',data:'w=saveExpressCheckoutBillingAddress&'
+$('#NewBillingAddress').serialize()
+'&BillingAddressType='+addressType
+createAppend,success:ExpressCheckout.HandleResponse});return false;},ChooseShippingAddress:function(copyBilling)
{if(!$('#ShippingAddressTypeExisting:checked').val()||$('#ChooseShippingAddress').css('display')=='none'){if(!ExpressCheckout.ValidateNewAddress('shipping')){return false;}
addressType='new';}
else if($('.SelectShippingAddress select option:selected').val()==-1){alert(lang.ExpressCheckoutChooseShipping);$('.SelectShippingAddress select').focus();return false;}
else{addressType='existing';}
$.ajax({url:'remote.php',type:'post',dataType:'json',data:'w=saveExpressCheckoutShippingAddress&'
+$('#NewShippingAddress').serialize()
+'&ShippingAddressType='+addressType,success:ExpressCheckout.HandleResponse});return false;},SetBillingAndShippingAddress:function()
{billingAddress=$('.SelectBillingAddress select option:selected').html().substring(0,58);$('#CheckoutStepBillingAddress .ExpressCheckoutCompletedContent').html(billingAddress+'...');$('#CheckoutStepBillingAddress').addClass('ExpressCheckoutBlockCompleted');ExpressCheckout.ChooseShippingAddress();return false;},ChooseShippingProvider:function()
{var shippingValid=true;$('#CheckoutStepShippingProvider .ShippingProviderList').each(function(){if(!$(this).find('input[type=radio]:checked').val()){alert(lang.ExpressCheckoutChooseShipper);$(this).find('input[type=radio]').get(0).focus();shippingValid=false;return false;}});if(shippingValid==false){return false;}
$.ajax({url:'remote.php',type:'post',dataType:'json',data:'w=saveExpressCheckoutShippingProvider&'+$('#CheckoutStepShippingProvider form').serialize(),success:ExpressCheckout.HandleResponse});return false;},ShowLoadingIndicator:function(step){if(typeof(step)=='undefined'){step='body';}
$(step).find('.ExpressCheckoutBlock input[type=submit]').each(function(){var btn=$(this);btn.attr('oldvalue',btn.val()).val(lang.ExpressCheckoutLoading).attr('disabled',true).addClass('btn-secondary');});$('body').css('cursor','wait');},HideLoadingIndicators:function()
{HideLoadingIndicator();$('.ExpressCheckoutBlock input[type=submit]').each(function(){var btn=$(this);if(btn.attr('oldvalue')&&btn.prop('disabled')){btn.val(btn.attr('oldvalue')).attr('disabled',false).removeClass('btn-secondary');}});$('body').css('cursor','default');},LoadOrderConfirmation:function()
{postVars.w='expressCheckoutShowConfirmation';$.ajax({url:'remote.php',type:'post',dataType:'json',data:postVars,success:ExpressCheckout.HandleResponse});},HidePaymentForm:function()
{$('#CheckoutStepPaymentDetails').hide();$('#CheckoutStepPaymentDetails .ExpressCheckoutContent').html('');},LoadPaymentForm:function(provider)
{$.ajax({url:'remote.php',data:'w=expressCheckoutLoadPaymentForm&'+$('#CheckoutStepConfirmation form').serialize(),dataType:'json',type:'post',success:ExpressCheckout.HandleResponse});},ShowSingleMethodPaymentForm:function()
{$('#CheckoutStepPaymentDetails').show();ShowContinueButton();},ValidateNewAccount:function()
{var password,confirmPassword,formfield=FormField.GetValues(CustomCheckoutFormNewAccount);for(var i=0;i<formfield.length;i++){if(formfield[i].privateId=='EmailAddress'){if(ExpressCheckout.validateEmailAddress(formfield[i].value)==false){alert(lang.LoginEnterValidEmail);FormField.Focus(formfield[i].field);return false;}}
if(formfield[i].privateId=='Password'){if(!ExpressCheckout.createAccount){continue;}
password=formfield[i];}
else if(formfield[i].privateId=='ConfirmPassword'){if(!ExpressCheckout.createAccount){continue;}
confirmPassword=formfield[i];}
var rtn=FormField.Validate(formfield[i].field);if(!rtn.status){alert(rtn.msg);FormField.Focus(formfield[i].field);return false;}}
if(ExpressCheckout.createAccount&&password&&password.value!==confirmPassword.value){alert(lang.AccountPasswordsDontMatch);FormField.Focus(confirmPassword.field);return false;}
return true;},BuildAddressLine:function(type)
{var fieldList={'FirstName':'','LastName':'','Company':'','AddressLine1':'','City':'','State':'','Zip':'','Country':''};if(type=='billing'){var formId=CustomCheckoutFormBillingAddress;}
else{var formId=CustomCheckoutFormShippingAddress;}
var formfields=FormField.GetValues(formId);var addressLine='';for(var i=0;i<formfields.length;i++){fieldList[formfields[i].privateId]=formfields[i].value;}
for(var i in fieldList){var val=fieldList[i];if(val!==''){if(addressLine!=''&&i!='LastName'){addressLine+=', ';}else if(i=='LastName'){addressLine+=' ';}
addressLine+=val;}};return addressLine;},ValidateNewAddress:function(lowerType,resultOnly)
{if(resultOnly!==true){resultOnly=false;}
if(lowerType=='billing'){var formId=CustomCheckoutFormBillingAddress;}else{var formId=CustomCheckoutFormShippingAddress;}
var formfields=FormField.GetValues(formId);var hasErrors=false;for(var i=0;i<formfields.length;i++){var rtn=FormField.Validate(formfields[i].field);if(!rtn.status){if(!resultOnly){alert(rtn.msg);}
FormField.Focus(formfields[i].field);hasErrors=true;return false;}}
if(hasErrors==true){return false;}
else{return true;}},validateEmailAddress:function(email)
{if(email.indexOf('@')==-1||email.indexOf('.')==-1){return false;}
return true;},ToggleAddressType:function(address,type)
{if(type=='Select'){$('.Select'+address+'Address').show();$('.Add'+address+'Address').hide();}
else{$('.Add'+address+'Address').show();$('.Select'+address+'Address').hide();}},ConfirmPaymentProvider:function()
{if($('.CheckoutHideOrderTermsAndConditions').css('display')!="none"&&$('#AgreeTermsAndConditions').prop('checked')!=true){alert(lang.TickArgeeTermsAndConditions);return false;}
if(!confirm_payment_provider()){return false;}
var paymentProvider='';if($('#use_store_credit').css('display')!="none"){if($('#store_credit:checked').val()){if($('#credit_provider_list').css('display')!="none"){paymentProvider=$('#credit_provider_list input:checked');}}
else{paymentProvider=$('#provider_list input:checked');}}
else{paymentProvider=$('#provider_list input:checked');}
if(paymentProvider!=''&&$(paymentProvider).hasClass('ProviderHasPaymentForm')){var providerName=$('.ProviderName'+paymentProvider.val()).html();$('#CheckoutStepConfirmation .ExpressCheckoutCompletedContent').html(providerName);ExpressCheckout.LoadPaymentForm($(paymentProvider).val());return false;}
else{ExpressCheckout.HidePaymentForm();return true;}},ApplyCouponCode:function()
{if($('#couponcode').val()==''){alert(lang.EnterCouponCode);$('#couponcode').focus();return false;}
$.ajax({url:'remote.php',data:'w=getExpressCheckoutConfirmation&'+$('#CheckoutStepConfirmation form').serialize(),dataType:'json',type:'post',success:ExpressCheckout.HandleResponse});return false;},UncheckPaymentProvider:function()
{$('#provider_list input').each(function(){$(this).attr('checked',false);});}};