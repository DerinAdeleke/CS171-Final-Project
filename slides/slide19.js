(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-17">
			<div class="slide-content">
				<h2 class="section-title">Our Team</h2>
				<p class="section-subtitle">Creators of this luxury data experience</p>
				
				<div class="team-content">
					<div class="team-grid">
						<div class="team-member">
							<div class="team-name">Derin Adeleke</div>
							<div class="decorative-line"></div>
							<div class="team-email">
								<a href="mailto:derinadeleke@college.harvard.edu">derinadeleke@college.harvard.edu</a>
							</div>
						</div>

						<div class="team-member">
							<div class="team-name">Cindy Sun</div>
							<div class="decorative-line"></div>
							<div class="team-email">
								<a href="mailto:csun@g.harvard.edu">csun@g.harvard.edu</a>
							</div>
						</div>

						<div class="team-member">
							<div class="team-name">Patience Madumera</div>
							<div class="decorative-line"></div>
							<div class="team-email">
								<a href="mailto:pmadumera@college.harvard.edu">pmadumera@college.harvard.edu</a>
							</div>
						</div>
					</div>

					<div class="decorative-line" style="margin-top: 80px;"></div>
					<p style="text-align: center; color: #888; margin-top: 40px; letter-spacing: 0.3em; font-size: 1em;">
						HARVARD UNIVERSITY • CS1710 • FALL 2025
					</p>
					<p style="text-align: center; color: #d4af37; margin-top: 20px; letter-spacing: 0.2em; font-size: 0.9em; font-style: italic;">
						Thank you for exploring with us
					</p>
				</div>
			</div>
		</section>
	`);
})();
