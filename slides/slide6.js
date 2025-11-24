(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-chapter">
			<div class="slide-content">
				<div class="chapter-content">
					<div class="chapter-number">CHAPTER II</div>
					<h1 class="chapter-title">The Market Today</h1>
					<div class="decorative-line"></div>
					<p class="chapter-text">
						From heritage to hypergrowth.<br><br>
						Today, luxury is no longer confined to Parisian ateliers or Manhattan boutiques. It's a $42+ billion global phenomenon, 
						driven by digital transformation and emerging markets.<br><br>
						The data reveals an industry in unprecedented expansion—and unexpected evolution.
					</p>
				</div>
			</div>
		</section>
	`);
})();
