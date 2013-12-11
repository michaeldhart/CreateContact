$(document).ready(function() {
	//helper function to determine if this is a touch-enabled device.
		//on some touch devices a tap fires both touchstart and click- resulting in 2 events
		//this eliminates that problem
		var flexClick = function() {
			if (Modernizr.hasEvent('touchstart')) {
				return 'touchstart';
			} else {
				return 'click';
			}
		}
	//helper function to determine if this is a touch-enabled device.

	//Contact / Job Photo js
		var $contactPhoto = $('#contact-photo');
		var $contactPhotoInput = $('#contact-photo-input');

		var $jobPhoto = $('#job-photo');
		var $jobPhotoInput = $('#job-photo-input');

		//open file chooser on contact photo click
		$contactPhoto.on(flexClick(), function() {
			$contactPhotoInput.click();
		});

		$jobPhoto.on(flexClick(), function() {
			$jobPhotoInput.click();
		});

		//Set image src when a photo is chosen
		$contactPhotoInput.on('change', function() {
			setImageSrc($(this));
		});

		$jobPhotoInput.on('change', function() {
			setImageSrc($(this));
		});


		function setImageSrc(context) {
			var $self = context;
			if ($self.val()) {
				if (window.FileReader && window.FileList) {
					var file = $self[0].files[0];
					var r = new FileReader();
					r.onload = updateProgress;
					r.readAsDataURL(file);

					function updateProgress(e) {
						if (e.lengthComputable) {
							if (e.loaded == e.total) {
								displayImage(e.target.result);
							}
						}
					}

					function displayImage(data) {
						//we'll draw the image to a canvas to crop it to a square before using it
						var can = document.createElement("canvas");
						var ctx = can.getContext("2d");

						var img = document.createElement("img");
						img.onload = function() {
							//we need to figure out how big of a square we're cropping to
							// get the original dimensions
							var origWidth = img.width;
							var origHeight = img.height;

							var square;
							if (origWidth >= origHeight) {
								square = origHeight;
							} else {
								square = origWidth;
							}

							//have to manually set the canvas size
							$(can).attr('width', square).attr('height', square);

							//start cropping here (will crop to center)
							var sx = Math.floor((origWidth - square) / 2);
							var sy = Math.floor((origHeight - square) / 2);

							//end cropping here
							var sw = sx + square;
							var sh = sy + square;

							//draw to canvas, and export to the page
							ctx.drawImage(img, sx, sy, sw, sh, 0, 0, square, square);
							var croppedImage = can.toDataURL("image/png");
							$self.siblings('img').attr('src', croppedImage);
						}

						img.src = data;

						
					}
				}
			}
		};
	//Contact / Job Photo js

	//Phone js

		//format phone numbers
			$('input[type=phone]').keyup(function(e) {
				var $self = $(this);
				
				//remove anything but numbers (but still allow backspace)
				if (!(e.which > 47 && e.which < 58) && !(e.which > 92 && e.which < 106) && e.which != 8 ) {
					$self.val($self.val().substring(0, $self.val().length - 1));
				}

				var l = $self.val().length;

				//if we aren't backspacing- format numbers
				if (e.which != 8) {
					if (l === 3) {
						$self.val('(' + $self.val() + ') ');
					} else if (l === 9) {
						$self.val($self.val() + '-');
					}
				} else {
					//if we are backspacing- delete the formatting and next number
					if (l === 9) {
						$self.val($self.val().substring(0, $self.val().length - 1));
					} else if (l === 5) {
						$self.val($self.val().substring(0, $self.val().length - 2));
					} else if (l === 1) {
						$self.val('');
					}
				}
			});
		//format phone numbers

		//set toggled classes on phone type buttons
			$('.modal-body').on(flexClick(), '.add-phone-input-type', function() {
				$('.add-phone-input-type').removeClass('selected btn-primary').addClass('btn-default');
				$(this).addClass('selected btn-primary');
			});
		//set toggled classes on phone type buttons

		//validate new phone and send to page

			$('#add-phone-save').on(flexClick(), function() {
				var isPrimary = $('#add-phone-primary').is(':checked');
				var primaryButton = '<button class="btn btn-default set-primary"><span class="glyphicon glyphicon-star"></span></button>';
				var phoneNumber = $('#add-phone-input').val();
				var ext = $('#add-phone-ext-input').val();
				var deletePhone = '<button class="btn btn-default delete-phone"><span class="glyphicon glyphicon-remove"></span></button>';
				var $numberAdded = $('<div class="row"><div class="col-xs-1">' + primaryButton + '</div>' + 
										'<div class="col-xs-6"><input type="phone" class="form-control" value="' + phoneNumber + '" /></div>' + 
										'<div class="col-xs-3"><input type="text" class="form-control" placeholder="Ext." value="' + ext + '" /></div>' +
										'<div class="col-xs-1">' + deletePhone + '</div></div>');

				if (isPrimary) {
					$('#phones .primary').removeClass('primary');
					$numberAdded.find('.glyphicon-star').addClass('primary');
				}

				if (validatePhone()) {
					switch ($('.add-phone-input-type.selected').text()) {
						case 'Work':
							$('#work-phones').append($numberAdded);
							break;
						case 'Cell':
							$('#cell-phones').append($numberAdded);
							break;
						case 'Home':
							$('#home-phones').append($numberAdded);
							break;
					}

					//reset add phone form
					$('#add-phone-input').val('');
					$('#add-phone-ext-input').val('');
					$('.add-phone-input-type.selected').removeClass('selected btn-primary').addClass('btn-default');
					$('#add-phone-primary').removeAttr('checked');

					$('#add-phone-modal').modal('hide');
					$(document).trigger('change.Phone');
				}

				function validatePhone() {
					var numberErrors = 0;
					var $phoneInput = $('#add-phone-input');
					var $alert = $('#add-phone-modal .alert');

					$alert.hide().children('ul').empty();

					if ($phoneInput.val().length != 14) {
						$phoneInput.parent().addClass('has-error');
						$alert.children('ul').append('<li>Please enter a valid phone number</li>');
						numberErrors++;
					} else {
						$phoneInput.parent().removeClass('has-error');
					}

					if (!$('.add-phone-input-type.selected').length) {
						$('.add-phone-input-type').eq(0).parent().parent().parent().addClass('has-error');
						$alert.children('ul').append('<li>Please select a number type</li>');
						numberErrors++;
					} else {
						$('.add-phone-input-type').eq(0).parent().parent().parent().removeClass('has-error');
					}

					if (numberErrors > 0) {
						$alert.slideDown();
						return false;
					} else {
						return true;
					}
				}
			});
		//validate new phone and send to page

		//remove a phone
		$(document).on(flexClick(), '.delete-phone', function() {
			$(this).closest('.row').remove();
			$(document).trigger('change.Phone');
		//handle clicks of set primary buttons
		}).on(flexClick(), '#phones .set-primary', function() {
			$('#phones .primary').removeClass('primary');
			$(this).addClass('primary');
			$(document).trigger('change.Phone');
		//custom event to be fired whenever a phone's properties change and ui needs to be refreshed
		}).on('change.Phone', function() {

			//show the type headings if there are entries for this type
			$('#work-phones, #cell-phones, #home-phones').children('h3').each(function() {
				var $self = $(this);
				if ($self.siblings().length) {
					$self.show().parent().css('position', 'static');
				} else {
					$self.hide().parent().css('position', 'absolute');
				}
			});

			//move primary to top of it's list
			$('#phones .primary').closest('.row').each(function() {
				$self = $(this);
				if ($self.siblings('.row').length) {
					$self.fadeOut().insertBefore($self.siblings('.row').eq(0)).fadeIn();
				}
			});
		});
	//Phone js

	//Email js
		//validate and send to page
			$('#add-email-save').on(flexClick(), function() {
				var val = $('#add-email-input').val();
				var isPrimary = $('#add-email-primary').is(':checked');
				var primaryButton = '<button class="btn btn-default set-primary"><span class="glyphicon glyphicon-star"></span></button>';
				var deleteEmail = '<button class="btn btn-default delete-email"><span class="glyphicon glyphicon-remove"></span></button>';
				var $emailAdded = $('<div class="row"><div class="col-xs-1">' + primaryButton + '</div>' + 
										'<div class="col-xs-9"><input type="email" class="form-control" value="' + val + '" /></div>' + 
										'<div class="col-xs-1">' + deleteEmail + '</div></div>');

				if (isPrimary) {
					$('#emails .primary').removeClass('primary');
					$emailAdded.find('.glyphicon-star').addClass('primary');
				}
				
				if (validateEmail()) {
					$('#email-list').append($emailAdded);

					$('#add-email-input').val('');
					$('#add-email-primary').removeAttr('checked');
					$('#add-email-modal').modal('hide');

					$(document).trigger('change.Email');
				}

				function validateEmail() {
					var email = new RegExp(/^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,4}$/);
					var $alert = $('#add-email-modal .alert');

					$alert.hide();

					if (email.test(val)) {
						return true;
					} else {
						$alert.slideDown();
						return false;
					}
				}
			});
		//validate and send to page

		//remove email
		$(document).on(flexClick(), '.delete-email', function() {
			$(this).closest('.row').remove();
			$(document).trigger('change.Email');
		//handle clicks of set primary buttons
		}).on(flexClick(), '#emails .set-primary', function() {
			$('#emails .primary').removeClass('primary');
			$(this).addClass('primary');
			$(document).trigger('change.Email');
		//custom event to be fired whenever a email's properties change and ui needs to be refreshed
		}).on('change.Email', function() {

			//move primary to top of it's list
			$('#emails .primary').closest('.row').each(function() {
				$self = $(this);
				if ($self.siblings('.row').length) {
					$self.fadeOut().insertBefore($self.siblings('.row').eq(0)).fadeIn();
				}
			});
		});
	//Email js

	//Address js
		//create state selects
			var states = ['AK','AL','AR','AS','AZ','CA','CO','CT','DC','DE','FL','GA','GU','HI','IA','ID','IL','IN','KS','KY','LA','MA','MD','ME','MH','MI','MN','MO','MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY','OH','OK','OR','PA','PR','PW','RI','SC','SD','TN','TX','UT','VA','VI','VT','WA','WI','WV','WY'];
			var stateOpts = '';

			for (var i=0; i<states.length; i++) {
				var s = '<option>' + states[i] + '</option>';
				stateOpts += s;
			}

			$('select[id$="-state-input"]').append(stateOpts);
		//create state selects

		//gmap js
			//set height
				var map = $('#map-canvas');
				map.height(map.parent().width());
			//set height

			//get address, etc.
			$('#get-gmap').on(flexClick(), function() {
				var $street = $('#job-address-input');
				var $zip = $('#job-address-zip-input');
				var $alert = $('#job-location .alert');

				$street.parent().removeClass('has-error');
				$zip.parent().removeClass('has-error');

				$alert.hide();

				if ($street.val() && $zip.val()) {

					$(this).hide();
					$('#map-canvas').show();
					Gmaps.initialize();
					Gmaps.codeAddress($street.val() + ', ' + $zip.val());
					
				} else {
					$alert.slideDown();
					if (!$street.val()) {
						$street.parent().addClass('has-error');
					}
					if (!$zip.val()) {
						$zip.parent().addClass('has-error');
					}
				}
			})

			//get address, etc.
		//gmap js
	//Address js

	//Communication js
		//send to page
			$('#add-communication-button').on(flexClick(), function() {

				var date = '<div class="col-xs-11 col-sm-6"><label class="control-label">Date</label><input type="date" class="form-control" /></div>';
				var method = '<div class="col-xs-11 col-sm-5"><label class="control-label">Method</label><select class="form-control"><option>Phone</option><option>Email</option><option>In person</option></select></div>';
				var comments = '<div class="col-xs-11 col-sm-11"><label class="control-label">Comments</label><textarea class="form-control" rows="5"></textarea></div>';
				var deleteComm = '<div class="col-xs-1"><br><button class="btn btn-default delete-communication"><span class="glyphicon glyphicon-remove"></span></button></div>';
				var commAdded = '<div class="row communication-row"><div class="col-xs-11 col-sm-12"><div class="row">' + date + method + deleteComm + '</div>' +
										'<div class="row">' + comments + '</div>' + '</div></div>';

				$(this).before(commAdded);
			});
		//send to page

		//remove communication
		$(document).on(flexClick(), '.delete-communication', function() {
			$(this).closest('.communication-row').remove();
		//remove communication
		});
	//Communication js

	//Notes js
		//send to page
			$('#add-note-button').on(flexClick(), function() {

				var title = '<div class="col-xs-11"><label class="control-label">Title</label><input type="text" class="form-control" /></div>';
				var descrip = '<div class="col-xs-11"><label class="control-label">Description</label><textarea class="form-control" rows="5"></textarea></div>';
				var date = '<div class="col-xs-11 col-sm-5"><label class="control-label">Date</label><input type="date" class="form-control" /></div>';
				var by = '<div class="col-xs-11 col-sm-6"><label class="control-label">Created By</label><input type="text" class="form-control" /></div>';
				var deleteNote = '<div class="col-xs-1"><br><button class="btn btn-default delete-note"><span class="glyphicon glyphicon-remove"></span></button></div>';
				var noteAdded = '<div class="row note-row"><div class="col-xs-11 col-sm-12"><div class="row">' + title + deleteNote + '</div>' +
										'<div class="row">' + descrip + '</div>' +
										'<div class="row">' + date + by + '</div>' + '</div></div>';

				$(this).before(noteAdded);
			});
		//send to page

		//remove communication
		$(document).on(flexClick(), '.delete-communication', function() {
			$(this).closest('.communication-row').remove();
		//remove communication
		});
	//Notes js
});