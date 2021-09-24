// TODO: optimise google analytics
const TRACKING_ID = 'UA-xxxxxxxx-x';


window.ga = window.ga || function() {
	(ga.q = ga.q || [])
		.push(arguments);
};

ga.l = +new Date;


ga('create', TRACKING_ID, 'auto');
ga('send', 'pageview');
