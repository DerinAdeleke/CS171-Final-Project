(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-chapter">
			<div class="slide-content">
				<div class="chapter-content">
					<div class="chapter-number">CHAPTER IV</div>
					<h1 class="chapter-title">The Resale Revolution</h1>
					<div class="decorative-line"></div>
					<p class="chapter-text">
						A new economy is emerging—one where pre-loved is prestigious.<br><br>
						The secondary market isn't just about sustainability; it's a powerful indicator of brand equity. 
						When a Birkin sells for more than retail decades later, it reveals something profound about value, desire, and legacy.<br><br>
						Here's what the resale market tells us about these brands.
					</p>
				</div>
			</div>
		</section>
	`);
})();
