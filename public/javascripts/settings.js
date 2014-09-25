$(document).ready(function() {
	if(Modernizr.localstorage) {
		setRange($('.adj').find('[type=range]'));
		
		$('.adj').find('[type=range]').mousemove(function() {
			$('.adj').find('#rangeFac').text($(this).val());
		});
		
		$('.adj').find('[type=range]').change(function() {
			try {
				$('.adj').find('#rangeFac').text($(this).val());
				localStorage.setItem($(this).attr('type'), $(this).val());
				status({message: 'Range saved successfully.'});
			} catch(e) {
				status({error: e.name+': '+e.code});
				console.log(e);
			}
		});
		
		$('#adjReset').click(function(e) {
			if(checkStorage($('.adj').find('[type=range]'))) {
				if(confirm('You are going to reset your settings to default. \nAre you sure with that?')) {
					localStorage.removeItem($('.adj').find('[type=range]').attr('type'));
					setRange($('.adj').find('[type=range]'));
					status({message: 'Settings set to default successfully.'});
				}
			} else {
				status({info: 'Nothing to do. The Settings are already set to default.'});
			}
		});
	} else {
		$('.adj').find('[type=range]').change(function() {
			status({error: 'Feature disabled. Your browser doesn\'t support HTML5 localStorage.'});
		});
	}
	
	

	/** Shows a message */
    function status(message) {
		$('#createnote').click();
		if(message.error) {    
			$('.message').html('<i class="fa fa-exclamation-circle fa-fw"></i>');
			$('.message').append(message.error).show();
		} else {
			if(message.info) {   
				$('.message').html('<i class="fa fa-info-circle fa-fw"></i>');
				$('.message').append(message.info).show();
			} else {
				$('.message').html('<i class="fa fa-check-circle fa-fw"></i>');
				$('.message').append(message.message).show();
			}
			setTimeout(function() {
				$('#lean_overlay').hide();
				$('.status').hide();
			}, 3000);
		}
    }
	
	
	
	/** Set range value */
	function setRange(r) {
		if(localStorage.getItem(r.attr('type'))) {
			r.val(localStorage.getItem(r.attr('type')));
			$('.adj').find('#rangeFac').text(r.val());
		} else {
			r.val(1);
			$('.adj').find('#rangeFac').text('1');
		
		}
	}
	function checkStorage(r) {
		return localStorage.getItem(r.attr('type')) ? true : false;
	}
});