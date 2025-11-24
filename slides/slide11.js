(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-9">
			<div class="slide-content">
				<h2 class="section-title">Best Sellers</h2>
				<p class="section-subtitle">A curated selection of iconic pieces from each house</p>
				
				<div class="brand-filter-buttons">
					<button class="luxury-button active" data-product-brand="all">All Products</button>
					<button class="luxury-button" data-product-brand="Coach">Coach</button>
					<button class="luxury-button" data-product-brand="Gucci">Gucci</button>
					<button class="luxury-button" data-product-brand="Hermès">Hermès</button>
				</div>

				<div class="carousel-container">
					<div class="carousel-track" id="product-carousel"></div>
				</div>

				<div class="carousel-nav">
					<button class="carousel-button" id="carousel-prev"><span>‹</span></button>
					<div class="carousel-dots" id="carousel-dots"></div>
					<button class="carousel-button" id="carousel-next"><span>›</span></button>
				</div>
			</div>
		</section>
	`);

	let productData = [];
	let currentProductIndex = 0;
	let filteredProducts = [];

	window.loadProducts = async function() {
		const data = await d3.csv("best_selling_products.csv");
		productData = data;
		filteredProducts = productData;
		createProductCarousel();
	};

	function createProductCarousel() {
		const brandColors = window.brandColors;
		const carousel = d3.select("#product-carousel");
		carousel.html("");

		filteredProducts.forEach((product, index) => {
			const card = carousel.append("div")
				.attr("class", "product-card")
				.style("opacity", 0)
				.style("transform", "translateY(30px)");

			const imageContainer = card.append("div").attr("class", "product-image-container");
			imageContainer.append("img")
				.attr("src", `product_images/${product.Image}`)
				.attr("alt", product.Product)
				.attr("class", "product-image");

			card.append("div").attr("class", "product-brand")
				.style("color", brandColors[product.Brand]).text(product.Brand);
			card.append("div").attr("class", "product-name").text(product.Product);
			card.append("div").attr("class", "product-price").text(`$${product.Price}`);

			card.transition().duration(600).delay(index * 100)
				.style("opacity", 1).style("transform", "translateY(0)");
		});

		updateCarouselDots();
		updateCarouselPosition();
	}

	function updateCarouselDots() {
		const dotsContainer = d3.select("#carousel-dots");
		dotsContainer.html("");
		const numDots = Math.max(1, filteredProducts.length - 2);
		for (let i = 0; i < numDots; i++) {
			dotsContainer.append("div")
				.attr("class", "carousel-dot")
				.classed("active", i === currentProductIndex)
				.on("click", function() {
					currentProductIndex = i;
					updateCarouselPosition();
				});
		}
	}

	function updateCarouselPosition() {
		const track = d3.select("#product-carousel");
		const offset = -currentProductIndex * 360;
		track.style("transform", `translateX(${offset}px)`);
		d3.selectAll(".carousel-dot").classed("active", false)
			.filter((d, i) => i === currentProductIndex).classed("active", true);
	}

	// Carousel navigation
	d3.select("#carousel-prev").on("click", function() {
		if (currentProductIndex > 0) {
			currentProductIndex--;
			updateCarouselPosition();
		}
	});

	d3.select("#carousel-next").on("click", function() {
		const maxIndex = Math.max(0, filteredProducts.length - 3);
		if (currentProductIndex < maxIndex) {
			currentProductIndex++;
			updateCarouselPosition();
		}
	});

	// Brand filter
	d3.selectAll(".brand-filter-buttons .luxury-button").on("click", function() {
		const brand = d3.select(this).attr("data-product-brand");
		currentProductIndex = 0;
		d3.selectAll(".brand-filter-buttons .luxury-button").classed("active", false);
		d3.select(this).classed("active", true);

		if (brand === "all") {
			filteredProducts = productData;
		} else {
			filteredProducts = productData.filter(d => d.Brand === brand);
		}
		createProductCarousel();
	});
})();
