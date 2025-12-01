(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-chapter">
			<div class="slide-content">
				<div class="chapter-content">
					<div class="chapter-number">CHAPTER V</div>
					<h1 class="chapter-title">The Big Picture</h1>
					<div class="decorative-line"></div>
					<p class="chapter-text">
						From heritage to hypergrowth. From retail to resale. From exclusivity to accessibility.<br><br>
						Three brands. Three strategies. Three very different paths to the same destination: enduring luxury.<br><br>
						What we've learned isn't just about fashion—it's about value, identity, and the eternal human desire 
						to own something beautiful that lasts.
					</p>
				</div>
			</div>
		</section>
	`);
})();
