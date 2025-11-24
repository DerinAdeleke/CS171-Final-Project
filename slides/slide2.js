(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-chapter">
			<div class="slide-content">
				<div class="chapter-content">
					<div class="chapter-number">CHAPTER I</div>
					<h1 class="chapter-title">The Heritage</h1>
					<div class="decorative-line"></div>
					<p class="chapter-text">
						Before the billions in revenue, before the global reach, there were visionaries.<br><br>
						Three houses. Three centuries. Three distinct philosophies that would come to define luxury itself.<br><br>
						This is where our story begins—with the craftsmen who built empires from leather and thread.
					</p>
				</div>
			</div>
		</section>
	`);
})();
