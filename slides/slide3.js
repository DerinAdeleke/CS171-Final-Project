(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-3">
			<div class="slide-content">
				<h2 class="section-title">Heritage & Evolution</h2>
				<p class="section-subtitle">A journey through centuries of luxury craftsmanship</p>
				
				<!-- Insight Lightbulb Button -->
				<button id="insights-btn-history" style="
					position: absolute;
					top: 20px;
					right: 20px;
					width: 50px;
					height: 50px;
					border-radius: 50%;
					background: linear-gradient(135deg, #d4af37 0%, #f0c55d 100%);
					border: 2px solid #d4af37;
					cursor: pointer;
					box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
					animation: pulse 2s infinite;
					z-index: 100;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 24px;
					transition: all 0.3s;
				" title="View Historical Insights">💡</button>
				
				<div class="timeline-controls">
				<button class="luxury-button" data-timeline-brand="all" style="border-color: #ffffff; color: #ffffff; background: transparent;">All Brands</button>
				<button class="luxury-button" data-timeline-brand="Hermès" style="border-color: #8B2635; color: #8B2635;">Hermès</button>
				<button class="luxury-button" data-timeline-brand="Gucci" style="border-color: #d4af37; color: #d4af37;">Gucci</button>
				<button class="luxury-button" data-timeline-brand="Coach" style="border-color: #8b4513; color: #8b4513;">Coach</button>
			</div>

			<!-- Background Heritage Images -->
			<div class="timeline-bg-images">
					<div class="timeline-bg-img timeline-bg-img-1">
						<img src="timeline_images/heritage1.png" alt="Heritage 1">
					</div>
					<div class="timeline-bg-img timeline-bg-img-2">
						<img src="timeline_images/heritage2.png" alt="Heritage 2">
					</div>
					<div class="timeline-bg-img timeline-bg-img-3">
						<img src="timeline_images/heritage3.png" alt="Heritage 3">
					</div>
				<div class="timeline-bg-img timeline-bg-img-4">
					<img src="timeline_images/heritage4.png" alt="Heritage 4">
				</div>
			</div>
			
			<p class="timeline-instruction">← Scroll left/right to browse the timeline. Use the buttons above to filter by brand. →</p>

			<div class="timeline-container">
					<div class="timeline-scroll-container">
						<div id="brand-timeline"></div>
					</div>
				</div>
			</div>
		</section>
		
		<!-- Insights Modal -->
		<div id="insights-modal-history" style="
			display: none;
			position: fixed;
			z-index: 1000;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.85);
			align-items: center;
			justify-content: center;
		">
			<div style="
				background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
				border: 2px solid #d4af37;
				border-radius: 20px;
				padding: 40px;
				max-width: 700px;
				width: 90%;
				max-height: 80vh;
				overflow-y: auto;
				box-shadow: 0 0 50px rgba(212, 175, 55, 0.5);
				position: relative;
			">
				<button class="close-insights" style="
					position: absolute;
					top: 20px;
					right: 25px;
					font-size: 35px;
					font-weight: bold;
					color: #d4af37;
					background: none;
					border: none;
					cursor: pointer;
					transition: color 0.3s;
				">&times;</button>
				
				<h2 style="
					color: #d4af37;
					font-size: 32px;
					margin-bottom: 30px;
					text-align: center;
					font-family: 'Playfair Display', serif;
				">What History Reveals</h2>
				
				<div style="display: flex; flex-direction: column; gap: 25px;">
					<div style="
						background: rgba(212, 175, 55, 0.1);
						border-left: 4px solid #8B2635;
						padding: 20px;
						border-radius: 8px;
					">
						<h3 style="color: #8B2635; margin-bottom: 10px; font-size: 22px;">📜 188 Years of Hermès Journey</h3>
						<p style="color: #e0e0e0; line-height: 1.6; font-size: 16px;">
							From a humble harness workshop in 1837 to global luxury icon, Hermès' timeline spans nearly two centuries. 
							The brand's evolution from equestrian heritage to the legendary Kelly (1956) and Birkin (1984) bags demonstrates 
							unparalleled craftsmanship continuity. Each milestone represents a commitment to artisanal excellence that has 
							remained constant across generations.
						</p>
					</div>
					
					<div style="
						background: rgba(212, 175, 55, 0.1);
						border-left: 4px solid #d4af37;
						padding: 20px;
						border-radius: 8px;
					">
						<h3 style="color: #d4af37; margin-bottom: 10px; font-size: 22px;">⚡ Post-War Boom Era</h3>
						<p style="color: #e0e0e0; line-height: 1.6; font-size: 16px;">
							The 1940s-1960s marked explosive growth across all three brands. Gucci (1921) and Coach (1941) emerged during 
							turbulent times but found their footing in the post-war economic expansion. This era saw the birth of iconic 
							products: Gucci's bamboo handle bag (1947), Hermès' Kelly bag (1956), and Coach's expansion beyond leather goods. 
							The timeline reveals how global prosperity fueled luxury demand.
						</p>
					</div>
					
					<div style="
						background: rgba(212, 175, 55, 0.1);
						border-left: 4px solid #8b4513;
						padding: 20px;
						border-radius: 8px;
					">
						<h3 style="color: #8b4513; margin-bottom: 10px; font-size: 22px;">👜 Iconic Product Innovations</h3>
						<p style="color: #e0e0e0; line-height: 1.6; font-size: 16px;">
							Each brand's timeline is punctuated by game-changing product launches. Hermès' Birkin bag (1984) wasn't just 
							a handbag—it became a cultural phenomenon and investment piece. Gucci's Double G logo (1960s) and signature 
							patterns created instant brand recognition. Coach's affordable luxury positioning (1980s-2000s) democratized 
							premium leather goods. These innovations weren't accidents—they were strategic responses to evolving consumer desires.
						</p>
					</div>
				</div>
			</div>
		</div>
	`);

	window.createBrandTimeline = function() {
		const timelineData = [
			// Hermès Timeline
			{year: 1837, brand: "Hermès", title: "Founded in Paris", description: "Thierry Hermès establishes harness workshop on Rue Basse-du-Rempart"},
			{year: 1880, brand: "Hermès", title: "First Leather Goods", description: "Production of high-quality leather goods begins"},
			{year: 1922, brand: "Hermès", title: "Silk Scarves", description: "Introduction of the iconic silk scarves"},
			{year: 1937, brand: "Hermès", title: "The First Handbag", description: "Launch of the first Hermès handbag, the 'Sac à dépêches'"},
			{year: 1956, brand: "Hermès", title: "Kelly Bag", description: "The 'Kelly Bag' is introduced, named after Grace Kelly"},
			{year: 1984, brand: "Hermès", title: "Birkin Bag", description: "Introduction of the 'Birkin Bag', designed for Jane Birkin"},
			{year: 2004, brand: "Hermès", title: "Apple Partnership", description: "Collaboration with Apple to create luxury tech accessories"},
			{year: 2010, brand: "Hermès", title: "Sustainable Initiatives", description: "Hermès begins to emphasize sustainable and ethical practices"},
			{year: 2020, brand: "Hermès", title: "Digital Expansion", description: "Significant expansion of e-commerce and digital presence"},

			// Gucci Timeline
			{year: 1921, brand: "Gucci", title: "Founded in Florence", description: "Guccio Gucci opens his first shop in Florence, selling leather goods and luggage"},
			{year: 1938, brand: "Gucci", title: "The Green-Red-Green Stripe", description: "Introduction of the iconic web stripe, inspired by the saddle girth of Guccio's horse"},
			{year: 1947, brand: "Gucci", title: "The Bamboo Bag", description: "Launch of the 'Bamboo Bag', featuring a distinctive bamboo handle"},
			{year: 1966, brand: "Gucci", title: "The Jackie Bag", description: "Introduction of the 'Jackie Bag', named after Jacqueline Kennedy"},
			{year: 1970, brand: "Gucci", title: "Gucci Watch", description: "Launch of the first Gucci watch collection"},
			{year: 1980, brand: "Gucci", title: "Tom Ford Era", description: "Tom Ford becomes the creative director, revitalizing the brand"},
			{year: 1994, brand: "Gucci", title: "Gucci Group", description: "Formation of the Gucci Group, merging several luxury brands under one umbrella"},
			{year: 2000, brand: "Gucci", title: "New Millennium", description: "Gucci continues to expand globally, opening new stores in key cities"},
			{year: 2015, brand: "Gucci", title: "Alessandro Michele", description: "Alessandro Michele becomes the creative director, introducing a new era of eclectic and romantic designs"},
			{year: 2020, brand: "Gucci", title: "Sustainability Commitment", description: "Gucci announces its commitment to become completely carbon neutral"},

			// Coach Timeline
			{year: 1941, brand: "Coach", title: "Founded in New York", description: "Coach opens as a family-run workshop in New York City"},
			{year: 1961, brand: "Coach", title: "The Original Coach Bag", description: "Introduction of the 'Original Coach Bag', made from hand-cut leather"},
			{year: 1970, brand: "Coach", title: "Signature Canvas", description: "Launch of the Signature Canvas, featuring the iconic 'C' logo"},
			{year: 1985, brand: "Coach", title: "Public Offering", description: "Coach goes public, trading on the New York Stock Exchange"},
			{year: 1996, brand: "Coach", title: "First Store in Japan", description: "Coach opens its first store in Japan, marking its global expansion"},
			{year: 2000, brand: "Coach", title: "Coach Poppy", description: "Introduction of the Coach Poppy collection, targeting a younger audience"},
			{year: 2013, brand: "Coach", title: "Rebranding", description: "Coach undergoes a major rebranding, including a new logo and store design"},
			{year: 2017, brand: "Coach", title: "Acquisition of Kate Spade", description: "Coach acquires Kate Spade & Company, expanding its portfolio"},
			{year: 2019, brand: "Coach", title: "Sustainability Goals", description: "Coach announces ambitious sustainability goals, including carbon neutrality"},
			{year: 2020, brand: "Coach", title: "Inclusive Expression", description: "Campaigns center on diversity, sustainability, and 'Coach Family'"}
		];

		const brandColors = window.brandColors || {
			"Hermès": "#8B2635",
			"Gucci": "#d4af37",
			"Coach": "#8b4513"
		};

		const container = d3.select("#brand-timeline");
		container.html("");

		const minYear = 1825;
		const maxYear = 2030;
		const yearRange = maxYear - minYear;
		const pixelsPerYear = 15;
		const totalWidth = yearRange * pixelsPerYear;

		const timeline = container.append("div")
			.style("position", "relative")
			.style("width", totalWidth + "px")
			.style("min-height", "250px");

		const axis = timeline.append("div")
			.attr("class", "timeline-axis");

		for (let year = 1840; year <= 2020; year += 20) {
			const position = ((year - minYear) / yearRange) * 100;
			timeline.append("div")
				.attr("class", "timeline-year-marker")
				.style("position", "absolute")
				.style("left", position + "%")
				.text(year);
		}

		const dots = timeline.selectAll(".timeline-dot")
			.data(timelineData)
			.enter()
			.append("div")
			.attr("class", "timeline-dot")
			.style("left", d => ((d.year - minYear) / yearRange) * 100 + "%")
			.style("background", d => brandColors[d.brand]);

		dots.each(function(d) {
			const dot = d3.select(this);
			const popup = dot.append("div")
				.attr("class", "timeline-popup")
				.style("border-color", brandColors[d.brand]);

			popup.append("div")
				.attr("class", "timeline-brand-label")
				.style("background", brandColors[d.brand])
				.text(d.brand);

			popup.append("div")
				.attr("class", "timeline-title")
				.text(`${d.title} (${d.year})`);

			popup.append("div")
				.attr("class", "timeline-description")
				.text(d.description);

			dot.on("mouseover", () => popup.style("opacity", 1))
				.on("mouseout", () => popup.style("opacity", 0));
		});

		dots.transition()
			.duration(500)
			.delay((d, i) => i * 30)
			.style("opacity", 1);

		// Filter functionality
		d3.selectAll(".timeline-controls .luxury-button").on("click", function () {
			const rawBrand = d3.select(this).attr("data-timeline-brand");
			const selected = rawBrand.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

			d3.selectAll(".timeline-controls .luxury-button").classed("active", false);
			d3.select(this).classed("active", true);

			// Update button styling on click
			d3.selectAll(".timeline-controls .luxury-button").each(function() {
				const btn = d3.select(this);
				const brand = btn.attr("data-timeline-brand");
				const isActive = btn.classed("active");
				
				if (brand === "all") {
					if (isActive) {
						btn.style("background", "#ffffff").style("color", "#0a0a0a").style("border-color", "#ffffff");
					} else {
						btn.style("background", "transparent").style("color", "#ffffff").style("border-color", "#ffffff");
					}
				} else {
					const brandColor = brand === "Hermès" ? "#8B2635" : brand === "Gucci" ? "#d4af37" : "#8b4513";
					if (isActive) {
						btn.style("background", brandColor).style("color", "#0a0a0a").style("border-color", brandColor);
					} else {
						btn.style("background", "transparent").style("color", brandColor).style("border-color", brandColor);
					}
				}
			});

			dots.style("opacity", d => {
				const dataBrand = d.brand.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				if (selected === "all") return 1;
				return dataBrand === selected ? 1 : 0.15;
			})
			.style("pointer-events", d => {
				const dataBrand = d.brand.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				if (selected === "all") return "auto";
				return dataBrand === selected ? "auto" : "none";
			});

			dots.each(function (d) {
				const popup = d3.select(this).select(".timeline-popup");
				const dataBrand = d.brand.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				if (selected !== "all" && dataBrand !== selected) {
					popup.style("opacity", 0);
				}
			});
		});

		// Programmatically set initial state to "All Brands" WITHOUT the active styling
		d3.select('.timeline-controls .luxury-button[data-timeline-brand="all"]').classed("active", true);

		// Insights modal functionality
		const insightsBtn = document.getElementById('insights-btn-history');
		const insightsModal = document.getElementById('insights-modal-history');
		const closeBtn = insightsModal?.querySelector('.close-insights');

		if (insightsBtn && insightsModal) {
			insightsBtn.addEventListener('click', () => {
				insightsModal.style.display = 'flex';
			});

			if (closeBtn) {
				closeBtn.addEventListener('click', () => {
					insightsModal.style.display = 'none';
				});
			}

			window.addEventListener('click', (e) => {
				if (e.target === insightsModal) {
					insightsModal.style.display = 'none';
				}
			});
		}
	};
})();
