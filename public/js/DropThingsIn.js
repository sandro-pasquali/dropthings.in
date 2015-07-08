window.DropThingsIn = function(options) {

	options = options || {};
	
	var selector = options.selector;
	var preview = options.preview;
	var noop = function() {};

	var dropReceivers = document.querySelectorAll(options.selector);
	var dropReceiver;
	var onProgress = options.progress || noop;
	var onReceived = options.received || noop;
	var onComplete = options.complete || noop;
	var onError = options.error || noop;
	
	var s = 0;
	var APS = Array.prototype.slice;
	
	var setPreview = function(file, dReceiver) {
		if(typeof preview !== 'function') {
			return;
		}
		var reader = new FileReader();
		reader.onload = function(event) {
			var image = new Image();
			image.src = event.target.result;
			preview.call(dReceiver, image.src);
		};
		
		reader.readAsDataURL(file);
	};
	
	var getXhrObject = function(progress) {
		var xhr = new XMLHttpRequest();
		xhr.upload.onprogress = function(e) {
			var percentage;
			if(e.lengthComputable) {
				percentage = e.loaded / e.total * 100;
				percentage = percentage ? percentage : 0;
			}
			progress && onProgress(percentage);
		};	
		return xhr;
	};
	
	var upload = function(file) {
	
		if(!file || typeof file !== "object") {
			throw new TypeError("Unexpected file object");
		}
		
		
		var start = new Date().getTime();
		
		var formData = function(map) {
			var fd = new FormData();
			Object.keys(map).forEach(function(key) {
				fd.append(key, map[key]);
			});
			return fd;
		}; 
		
		var failure = function(jqxhr, status, err) {
			jqxhr.responseText = null;
			onError.call(fileMap, status, err);
		};
		
		var fileMap = {
			name	: file.name,
			type	: file.type,
			size	: file.size
		};
		
		$.ajax({
			type: "post",
			url: '/amazon/s3/uploadpolicy',
			xhr: function() {
				return getXhrObject(false);
			},
			cache: false,
			contentType: false,
			processData: false,
			data: formData(fileMap)
		}).done(function(data, status, jqxhr) {
	
			var sig = data.data;
			
			//	The HTTP location of file. Note that this endpoint does not actually exist
			//	until #onComplete is called (after the upload is complete)
			//
			fileMap.url = sig.bucketPath + sig.fileKey;
			
			//	At this point we have our policy and are going to upload the image.
			//	Because we have the local file we will optimistically insert
			//	that into the requested slot, such that the upload appears to
			//	be instantaneous. If there is an error, warn the implementation,
			//	which should do cleanup.
			//
			var reader = new FileReader();
	
			reader.onload = function() {
				//	Send back dataURL for local file to be used
				//	as #src
				//
				jqxhr.responseText = reader.result;
				onReceived.call(fileMap);
			};
			
			reader.readAsDataURL(file);
	
			$.ajax({
				type: "post",
				url: sig.bucketPath,
				xhr: function() {
					return getXhrObject(true);
				},
				cache: false,
				contentType: false,
				processData: false,
				data: formData({
					'AWSAccessKeyId'	: sig.AWSAccessKeyId,
					'Content-Type'		: sig['Content-Type'],
					'acl'				: sig.acl,
					'key'				: sig.fileKey,
					'policy'			: sig.policy,
					'signature'			: sig.signature,
					'file'				: file				
				})
			})
			.done(function() {
				var end = new Date().getTime();
	
				onComplete.call(fileMap, {
					start	: start,
					end		: end,
					total	: end - start
				});
			})
			.fail(failure)
			
		}).fail(failure);
	};
	
	for(; s < dropReceivers.length; ++s) {
		dropReceiver = dropReceivers[s];

		dropReceiver.ondrop = function(e) {
			options.drop && options.drop.call(this);
			e.preventDefault();
			APS.call(e.dataTransfer.files).forEach(function(file) {
				setPreview(file, dropReceiver);
				upload(file);
			});
		};
		
		dropReceiver.ondragover = options.dragover || noop;
		dropReceiver.ondragleave  = options.dragleave || noop;
		dropReceiver.ondragend = options.dragend || noop;
	}
};
