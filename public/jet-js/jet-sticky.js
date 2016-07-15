$(function() {
	var sticky = document.getElementsByClassName('jet-sticky')[0],
			doc = document.documentElement,
			menuWrapper,
			menuExtd,
			inner,
			burger,
			offsetTop = 0, 
			isHidden = true, 
			isMenuVisible = false,
			distance = 200;

	inner = document.getElementsByClassName('jet-sticky__inner')[0]
	burger = document.getElementsByClassName('jet-sticky__dotburger')[0]
	menuWrapper = document.createElement('div');
	menuWrapper.className = 'jet-sticky__menu';
	menuExtd = document.querySelectorAll('.h-menu__item a');

	// copy site navigation
	menuExtd.forEach(function(item, i) {
		var link = document.createElement('a');
		link.href = item.href;
		link.innerHTML = item.innerHTML;
		link.className = 'jet-sticky__menu-item';
		if (item.className === 'h-menu__link_active') {
			link.className += " jet-sticky__menu-item--active"
		}
		menuWrapper.appendChild(link)
	});
	
	inner.appendChild(menuWrapper); 

	burger.addEventListener('click', function(e) {
		e.preventDefault();
		if (!isMenuVisible) {
			$(sticky).addClass('jet-sticky--menu-visible');
			$(menuWrapper).stop(true, true).slideDown();
			isMenuVisible = true;

		} else {
			$(sticky).removeClass('jet-sticky--menu-visible');
			$(menuWrapper).stop(true, true).slideUp();
			isMenuVisible = false;
		}

	})

	window.addEventListener('scroll', function() {
		offsetTop = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

		if (offsetTop > distance && !!isHidden) {
			isHidden = false;
			sticky.className += ' jet-sticky--is-active'
		} else if (offsetTop < distance && !isHidden) {
			isHidden = true;
			sticky.className = 'jet-sticky';
		}
	});

	$('.jet-sticky__share').on('click', function(e) {
		e.preventDefault();
		var url = $(this).attr('data-share');
		window.open(url, '', 'toolbar=0,status=0,width=626,height=436');
	})

});