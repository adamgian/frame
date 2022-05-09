const ANIMATION_DURATION = 300;
const CONTENT = document.querySelector('.content');




document.addEventListener('click', handleClick);

window.addEventListener('popstate', async (event) => {
	updateAnchorStatesPreLoad();
	await fetchPage(window.location.href);
	updateAnchorStatesPostLoad();
});




async function handleClick(event) {
	let target;

	// Ignore click handler if ctrl/command clicked.
	if (event.metaKey || event.ctrlKey) return;

	// Try to get anchor element that was clicked (if it was).
	target = event.target.closest('a');

	// Don't bother with running rest of code if
	// element that was clicked is not even an anchor.
	if (!target) return;

	// Check that link is not an external link
	if (target.host !== window.location.host) return;

	event.preventDefault();
	target.blur();

	updateAnchorStatesPreLoad(target);
	history.pushState({}, null, target.href);
	await fetchPage(window.location.href);
	updateAnchorStatesPostLoad();
}


/**
 * Fetches page at specified URL.
 *
 * @param {string} url
 */
function fetchPage(url) {
	let data = { title: '', content: '' };
	let animationStart = Date.now();
	let animationTimer;

	CONTENT.classList.add('is-loading');

	return fetch(url)
		.then(res => res.text())
		.then((body) => {
			data.title = body
				.split(/(<title>)\s*/)[2]
				.split(/\s*(<\/title>)/)[0];
			data.content = body
				.split(/(<main[^>]*>)\s*/)[2]
				.split(/\s*(<\/main>)/)[0];
		})
		.catch((err) => {
			data.title = 'Error';
			data.content = `<p>Sorry, there was a problem while fetching page.</p>`;
			console.log(err);
		})
		.finally(() => {
			animationTimer = ANIMATION_DURATION - (Date.now() - animationStart);

			if (animationTimer <= 0) {
				updateContent(data);
			}
			else {
				setTimeout(() => {
					updateContent(data);
				}, animationTimer);
			}
		});

}


/**
 * Replaces page title and page content with
 * the newly fetched page title and content.
 *
 * @param {Object} data
 * @param {string} data.title - Page title
 * @param {string} data.content - HTML content
 */
function updateContent(data) {

	let event;

	// If browser doesn't support Event API:
	// fallback init event to follow the Event API defaults
	// which is { bubbles: false, cancelable: false }
	if (typeof(Event) === 'function') {
		event = new Event('load');
	}
	else {
		event = document.createEvent('Event');
		event.initEvent('load', false, false);
	}

	// Update title and content
	document.title = data.title;
	CONTENT.textContent = '';
	CONTENT.insertAdjacentHTML('afterbegin', data.content);

	// Finalise page loading
	window.scrollTo(0, 0);
	window.dispatchEvent(event);
	CONTENT.classList.remove('is-loading');

}


/**
 * Tidy up/apply classes before page "render"
 *
 * @param {HTMLElement|string} target - target element or url
 */
function updateAnchorStatesPreLoad(target = window.location.href) {
	const anchors = document.querySelectorAll('a:not([href^=http])');

	// Going through each anchor that has an internal link.
	// If clicked link doesn't match, immediately skip.
	Array.from(anchors).forEach((anchor) => {
		anchor.classList.remove('is-active');

		if ((target !== anchor) && (target !== anchor.href)) return;

		// Add 'is-active' class to anchor that was clicked.
		// 'is-hovered' added to persist :hover state of anchor.
		anchor.classList.add('is-active', 'is-hovered');
	});
}


/**
 * Tidy up anchor classes after page "render"
 */
function updateAnchorStatesPostLoad() {
	const anchors = document.querySelectorAll('a:not([href^=http])');

	setTimeout(
		() => {
			// Need to remove any current 'is-hovered' class from anchor.
			Array.from(anchors).forEach((anchor) => {
				anchor.classList.remove('is-hovered');
			});
		},
		ANIMATION_DURATION
	);
}
