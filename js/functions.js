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


	const openModalButtons = document.querySelectorAll('[data-open-modal]');
	const doubleOpenModalButtons = document.querySelectorAll('[data-double-open-modal]');
	const closeModalButtons = document.querySelectorAll('[data-close-modal]');
	const modals = document.querySelectorAll('.page-modal');
	const formsWithModal = document.querySelectorAll('[data-open-modal-after-submit]');

	formsWithModal.forEach(form => {
		form.addEventListener('submit', (e) => {
			e.preventDefault();

			const modalSelector = form.dataset.openModalAfterSubmit;

			form.closest('.page-modal._show').classList.remove('_show');

			openModal(modalSelector);
		});
	});

	openModalButtons.forEach(button => {
		button.addEventListener('click', () => {
			setScrollWidth();

			const openedModal = document.querySelector('.page-modal._show');
			// if (openedModal) {
			// 	closeModal(openedModal);
			// }

			openModal(button.dataset.content);
		});
	});

	doubleOpenModalButtons.forEach(button => {
		button.addEventListener('dblclick', () => {
			setScrollWidth();

			const openedModal = document.querySelector('.page-modal._show');
			if (openedModal) {
				closeModal(openedModal);
			}

			openModal(button.dataset.content);
		});
	});

	closeModalButtons.forEach(button => {
		button.addEventListener('click', () => {
			const modal = button.closest('.page-modal');
			closeModal(modal);
		});
	});

	modals.forEach(modal => {
		modal.addEventListener('click', (e) => {
			if (e.target === modal) {
				closeModal(modal);
			}
		});
	});

	document.addEventListener('keydown', (e) => {
		if (e.key !== 'Escape') return;

		const openedModals = document.querySelectorAll('.page-modal._show');
		const lastModal = openedModals[openedModals.length - 1];

		if (lastModal) {
			closeModal(lastModal);
		}
	});


	// document.addEventListener('keydown', (e) => {
	// 	if (e.key !== 'Escape') return;

	// 	const openedModal = document.querySelector('.page-modal._show');
	// 	if (openedModal) {
	// 		closeModal(openedModal);
	// 	}
	// });

	// Выбор файла (только один файл)
	document.querySelectorAll('.file-selection input[type="file"]').forEach(input => {
		input.addEventListener('change', function () {
			const parent = this.closest('.file-selection');
			const pathName = parent.querySelector('.file-selection__path-name');
			const path = parent.querySelector('.file-selection__path');

			if (this.files.length === 1) {
				// Показываем только имя файла
				pathName.textContent = this.files[0].name;
				parent.classList.add('_active');
			} else {
				// Если файл не выбран, возвращаем дефолтный текст с HTML
				const defaultText = pathName.dataset.text;
				pathName.innerHTML = defaultText;
				parent.classList.remove('_active');
			}
		});
	});


	if ( document.querySelector('#myTable') ) {
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
	}

	const sortables = document.querySelectorAll('.sortable');

	if (sortables.length) {
		sortables.forEach(el => {
			new Sortable(el, {
				axis: 'y',
				handle: '.handle',
				animation: 150,
				cursor: 'move'
			});
		});
	}

	if (document.querySelector('.page-modal__scroll')) {
		addScrollPad();
	}


	document.addEventListener('click', e => {
		const select = e.target.closest('.custom-select');

		// Закрити всі select
		document.querySelectorAll('.options._show')
		.forEach(o => o.classList.remove('_show'));

		if (!select) return;

		const input = select.querySelector('.select-input');
		const options = select.querySelector('.options');
		const hidden = select.querySelector('input[type="hidden"]');

		// Клік по input
		if (e.target === input) {
			options.classList.add('_show');
			filterOptions(input, options);
		}

		// Клік по option
		if (e.target.tagName === 'LI') {
			input.value = e.target.textContent;
			hidden.value = e.target.dataset.value;
			options.classList.remove('_show');
		}
	});

	// Пошук
	document.addEventListener('input', e => {
		if (!e.target.classList.contains('select-input')) return;
		const select = e.target.closest('.custom-select');
		const options = select.querySelector('.options');
		options.classList.add('_show');

		filterOptions(e.target, options);
	});

	function filterOptions(input, options) {
		const value = input.value.toLowerCase();

		options.querySelectorAll('li').forEach(li => {
			li.hidden = !li.textContent.toLowerCase().includes(value);
		});
	}

	document.querySelectorAll('.form-sms__delete-btn').forEach(btn => {
		btn.addEventListener('click', function(e) {
			e.preventDefault();

			deleteItem = btn.closest('.delete-item');
			deleteItem.remove();
		});
	});

	// Tabs
	document.querySelectorAll(".tabs__btn").forEach(function(element) {
		element.addEventListener("click", function(e) {
			e.preventDefault();
	
			let parent = element.closest(".tabs-container");
			let activeTab = element.getAttribute("data-content");
	
			if (!element.classList.contains("_active")) {
				parent.querySelector(".tabs__btn._active").classList.remove("_active");
				parent.querySelector(".tab-content._active").classList.remove("_active");
	
				element.classList.add("_active");
				parent.querySelector(activeTab).classList.add("_active");
			}
		})
	})


	const openEditButtons = document.querySelectorAll('[data-open-edit]');
	const closeEditButtons = document.querySelectorAll('[data-close-edit]');

	openEditButtons.forEach(button => {
		button.addEventListener('click', () => {
			const modal = document.querySelector(button.dataset.content);
			if (!modal) return;

			modal.classList.add('_show');
		});
	});

	closeEditButtons.forEach(button => {
		button.addEventListener('click', () => {
			const modal = button.closest('.edit-info');
			console.log(modal)
			modal.classList.remove('_show');
		});
	});


	let dpMin, dpMax;

	dpMin = new AirDatepicker('#datepicker1', {
		isMobile: true,
		autoClose: true,
		timepicker: true,
		timeFormat: 'hh:mm AA',
		onSelect({date}) {
			dpMax.update({
				minDate: date
			})
		}
	})

	dpMax = new AirDatepicker('#datepicker2', {
		isMobile: true,
		autoClose: true,
		timepicker: true,
		timeFormat: 'hh:mm AA',
		onSelect({date}) {
			dpMin.update({
				maxDate: date
			})
		}
	})

	document.querySelectorAll('.accordion__open').forEach(button => {
		button.addEventListener('click', () => {
			button.closest('.accordion__item').classList.toggle('_show');
		});
	});


	document.querySelectorAll('.choose-items__item').forEach(item => {
		// ===== Чекбокси =====
		const mainCheckbox = item.querySelector('.checkbox_main input');
		const innerCheckboxes = item.querySelectorAll(
			'.choose-items__item-data .checkbox__label-choose input'
		);

		// Функція перевірки: чи всі внутрішні вибрані
		const updateMainCheckbox = () => {
			const allChecked = [...innerCheckboxes].length &&
				[...innerCheckboxes].every(cb => cb.checked);

			mainCheckbox.checked = allChecked;
		};

		// Початкова ініціалізація (якщо в HTML вже є checked)
		updateMainCheckbox();

		// Клік по головному
		mainCheckbox.addEventListener('change', () => {
			innerCheckboxes.forEach(cb => {
				cb.checked = mainCheckbox.checked;
			});
		});

		// Клік по внутрішніх
		innerCheckboxes.forEach(cb => {
			cb.addEventListener('change', updateMainCheckbox);
		});
	});
});

document.addEventListener('resize', () =>{
	if (document.querySelector('.page-modal__scroll')) {
		addScrollPad();
	}
});

function openModal(modalSelector) {
	const modal = document.querySelector(modalSelector);
	if (!modal) return;

	modal.classList.add('_show');
	document.querySelector('body').classList.add('_modal-look')
}

function closeModal(modal) {
	if (!modal) return;

	modal.classList.remove('_show');
	document.querySelector('body').classList.remove('_modal-look')
}


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


function setScrollWidth() {
  const hasScroll =
    document.documentElement.scrollHeight > window.innerHeight;

  const scrollbarWidth = hasScroll
    ? window.innerWidth - document.documentElement.clientWidth
    : 0;

  document.documentElement.style.setProperty(
    '--scroll_width',
    `${scrollbarWidth}px`
  );
}

// Функція для перевірки скролу і додавання класу
function addScrollPad() {
	// Вибираємо всі блоки з overflow-y: auto
	document.querySelectorAll('.page-modal__scroll').forEach(el => {
		// el.scrollHeight > el.clientHeight означає, що скрол можливий
		if (el.scrollHeight > el.clientHeight) {
			el.classList.add('page-modal__scroll_pad');
		} else {
			el.classList.remove('page-modal__scroll_pad'); // прибираємо клас, якщо скролу немає
		}
	});

	document.querySelectorAll('.info-page__colr').forEach(el => {
		// el.scrollHeight > el.clientHeight означає, що скрол можливий
		if (el.scrollHeight > el.clientHeight) {
			el.classList.add('info-page__colr_pad');
		} else {
			el.classList.remove('info-page__colr_pad'); // прибираємо клас, якщо скролу немає
		}
	});
}