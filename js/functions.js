// Observer API
const boxes = document.querySelectorAll('.lazyload')

function scrollTracking(entries) {
	for (const entry of entries) {
		if (entry.intersectionRatio > 0 && entry.target.getAttribute('data-src') && !entry.target.classList.contains('loaded')) {
			entry.target.classList.add('loaded')

			entry.target.src = entry.target.getAttribute('data-src')
		}
	}
}

const observer = new IntersectionObserver(scrollTracking, {
	threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
})

boxes.forEach(element => observer.observe(element))

document.addEventListener('DOMContentLoaded', () =>{
	// Mini modal header and page ladder.html 
	function isTouchDevice() {
		return 'ontouchstart' in window || navigator.maxTouchPoints;
	}

	document.querySelectorAll('.mini-modal__btn').forEach(btn => {
		btn.addEventListener('click', function(e) {
			e.preventDefault();
			const parent = btn.closest('.mini-modal');
			const modal = parent.querySelector('.mini-modal__modal');

			const isActive = btn.classList.contains('_active');

			document.querySelectorAll('.mini-modal__btn').forEach(b => b.classList.remove('_active'));
			document.querySelectorAll('.mini-modal__modal').forEach(m => m.classList.remove('_active'));

			if (btn.closest('.compain')) {
				document.querySelectorAll('.compain').forEach(m => m.classList.remove('_active'));
			}

			if (btn.closest('.items-item')) {
				document.querySelectorAll('.items-item').forEach(m => m.classList.remove('_active'));
			}

			if (isTouchDevice()) document.body.style.cursor = 'default';

			if (!isActive) {
				btn.classList.add('_active');
				if (modal) modal.classList.add('_active');

				if (btn.closest('.compain')) {
					btn.closest('.compain').classList.add('_active')
				}

				if (btn.closest('.items-item')) {
					btn.closest('.items-item').classList.add('_active')
				}

				if (isTouchDevice()) document.body.style.cursor = 'pointer';
			}
		});
	});

	document.addEventListener('click', function(e) {
		if (!e.target.closest('.mini-modal')) {
			document.querySelectorAll('.mini-modal__modal, .mini-modal__btn').forEach(el => el.classList.remove('_active'));

			document.querySelectorAll('.compain').forEach(m => m.classList.remove('_active'));
			document.querySelectorAll('.items-item').forEach(m => m.classList.remove('_active'));

			if (isTouchDevice()) document.body.style.cursor = 'default';
		}
	});
});