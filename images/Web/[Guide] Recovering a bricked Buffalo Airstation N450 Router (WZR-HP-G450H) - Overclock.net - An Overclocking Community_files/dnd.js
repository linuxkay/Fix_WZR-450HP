    var support = [];
	support['filereader']	= typeof FileReader != 'undefined';
	support['dnd']			= 'draggable' in document.createElement('span');
	support['formdata']		= !!window.FormData;
	support['progress']		= "upload" in new XMLHttpRequest;

	if(support['filereader'] && support['dnd'] && support['formdata']) {
		//we are green
		
	}
	else {
		//the browser doesn't support necessary technologies for drag and drop file upload
	}
	
	