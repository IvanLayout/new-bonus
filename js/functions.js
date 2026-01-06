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


const STORAGE_KEY = 'myTableColumns';

function saveTableState(table) {
	const ths = table.querySelectorAll('thead th');

	const order = [];
	const widths = [];

	ths.forEach(th => {
		order.push(th.dataset.key);
		widths.push(th.offsetWidth);
	});

	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify({ order, widths })
	);
}

function restoreTableState(table) {
	const saved = localStorage.getItem(STORAGE_KEY);
	if (!saved) return;

	const { order, widths } = JSON.parse(saved);

	const headRow = table.querySelector('thead tr');
	const bodyRows = table.querySelectorAll('tbody tr');

	order.forEach(key => {
		const th = headRow.querySelector(`th[data-key="${key}"]`);
		if (!th) return;

		headRow.appendChild(th);

		bodyRows.forEach(row => {
			const td = row.querySelector(`td[data-key="${key}"]`);
			if (td) row.appendChild(td);
		});
	});

	order.forEach((key, i) => {
		const th = headRow.querySelector(`th[data-key="${key}"]`);
		if (th && widths[i]) {
			th.style.width = widths[i] + 'px';
		}
	});
}

document.addEventListener('DOMContentLoaded', function () {
	const table = document.querySelector('#myTable');

	restoreTableState(table);

	const sortable = new Sortable(
    table.querySelector('thead tr'),
	{
		animation: 150,
		handle: 'th',
		draggable: 'th',
		filter: '.no-drag',
		onMove(evt) {
			const dragged = evt.dragged;
			const target  = evt.related;

			if (dragged.classList.contains('no-drag')) return false;
			if (target && target.classList.contains('no-drag')) return false;

			return true;
		},
		onEnd(evt) {
			const from = evt.oldIndex;
			const to = evt.newIndex;

			table.querySelectorAll('tbody tr').forEach(row => {
				const cells = row.children;
				const moving = cells[from];

				if (from < to) {
					row.insertBefore(moving, cells[to].nextSibling);
				} else {
					row.insertBefore(moving, cells[to]);
				}
			});

			saveTableState(table);
		}
    }
  );

  const columnResizer = new ColumnResizer(table, sortable);
});