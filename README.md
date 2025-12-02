# Luxury Fashion Data Story

An interactive data visualization exploring the luxury fashion market through the lens of three iconic brands: Hermès, Gucci, and Coach. This project tells a comprehensive story about luxury fashion using scroll-based storytelling, interactive visualizations, and real-world resale market data.

## 🚀 How to Run

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A local web server (required for loading CSV files)

### Setup Instructions

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/DerinAdeleke/CS171-Final-Project.git
   cd CS171-Final-Project
   ```

2. **Start a local web server**

   **Option A: Using Python 3**
   ```bash
   python3 -m http.server 8000
   ```

   **Option B: Using Python 2**
   ```bash
   python -m SimpleHTTPServer 8000
   ```

   **Option C: Using Node.js (http-server)**
   ```bash
   npx http-server -p 8000
   ```

   **Option D: Using VS Code**
   - Install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"

3. **Open in browser**
   - Navigate to `http://localhost:8000`
   - The visualization will load automatically

### Navigation
- **Scroll** to move between slides
- **Hover** over visualizations to see detailed information
- **Click** the lightbulb 💡 icons for insights
- Use **filter buttons** and **interactive controls** to explore data
- **Drag** sliders and timelines to see changes over time

## 📚 Libraries Used

### Core Visualization
- **D3.js v7** - Primary data visualization library for all charts, maps, and interactive elements
- **TopoJSON v3** - Geographic data processing for the world map visualization

### Built-in Browser APIs
- **Fetch API** - Asynchronous data loading
- **CSS Grid & Flexbox** - Responsive layout system
- **CSS Animations** - Smooth transitions and interactions

## 📊 Datasets

All datasets are located in the `/data` directory:

### Primary Datasets

1. **`vestiaire-hermès.csv`** (18,712 items)
   - Resale marketplace data for Hermès products
   - Columns: Brand, Category, Product, Condition, Price
   - Source: Vestiaire Collective marketplace

2. **`vestiaire-gucci.csv`** (41,010 items)
   - Resale marketplace data for Gucci products
   - Columns: Brand, Category, Product, Condition, Price
   - Source: Vestiaire Collective marketplace

3. **`vestiaire-coach.csv`** (2,265 items)
   - Resale marketplace data for Coach products
   - Columns: Brand, Category, Product, Condition, Price
   - Source: Vestiaire Collective marketplace

4. **`region_category_clean_data.csv`**
   - Revenue data by brand, category, and year (2012-2024)
   - Columns: Brand, Category, Year, Revenue
   - Used for: Category Performance Analysis, Market Overview

5. **`geoMap (3).csv`**
   - Google Trends search interest by country for each brand
   - Columns: Country, Hermès, Gucci, Coach
   - Used for: Global Brand Dominance map

6. **`topcountriestraffic.csv`**
   - Top 10 countries by luxury market engagement
   - Columns: Country, Traffic Share
   - Used for: Global Traffic Hub (hidden slide)

7. **`best_selling_products.csv`**
   - Curated selection of iconic products from each brand
   - Columns: Brand, Product, Category, Price, Image_URL
   - Used for: Best Sellers carousel

8. **`Top leading luxury brands.csv`**
   - Top 10 most valuable luxury brands globally (2024)
   - Columns: Brand, Country, Brand Value (billions)
   - Used for: Intro slide donut chart

9. **`resale_data.csv`**
   - Aggregated resale market statistics by brand and category
   - Used for: Resale market visualizations

### Hardcoded Data Constants

1. **Product Database** (`slides/slide18_5.js`)
   - 55 curated luxury products for the "Build Your Closet" feature
   - 15 Coach items, 20 Gucci items, 20 Hermès items
   - Each includes: price, condition, value retention %, heritage score, versatility score, accessibility score

2. **Timeline Data** (`slides/slide3.js`)
   - 30 historical milestones across three brands
   - Hermès: 9 events (1837-2020)
   - Gucci: 11 events (1921-2020)
   - Coach: 10 events (1941-2020)

3. **Brand Colors** (`index.html`)
   - Hermès: `#8B2635` (Burgundy)
   - Gucci: `#d4af37` (Gold)
   - Coach: `#8b4513` (Brown)

## 🎨 Project Structure

```
CS171-Final-Project/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # All styling and animations
├── data/                  # All CSV datasets
├── slides/                # Modular slide components
│   ├── slide1.js         # Title slide
│   ├── slide1_5.js       # "Did You Know?" intro
│   ├── slide2.js         # Chapter I divider
│   ├── slide3.js         # Brand timeline
│   ├── slide4.js         # Our Three Brands
│   ├── slide5.js         # Chapter II divider
│   ├── slide6.js         # Market Overview chapter
│   ├── slide7.js         # Market Overview visualization
│   ├── slide7_5.js       # Revenue comparison (hidden)
│   ├── slide8.js         # Global Traffic Hub (hidden)
│   ├── slide8_5.js       # Global Brand Dominance map
│   ├── slide9.js         # Chapter III divider
│   ├── slide10.js        # Category chapter
│   ├── slide11.js        # Best Sellers carousel
│   ├── slide12_5.js      # Category Performance Analysis
│   ├── slide13.js        # Chapter IV divider
│   ├── slide14.js        # Resale chapter
│   ├── slide15.js        # Resale overview (hidden)
│   ├── slide16.js        # Vestiaire Marketplace Dashboard
│   ├── slide17.js        # Chapter V divider
│   ├── slide17_5.js      # Build Your Closet chapter
│   ├── slide18_5.js      # Build Your Luxury Closet tool
│   ├── slide18.js        # Team intro
│   ├── slide19.js        # Team members
│   └── slide20.js        # Conclusion message
└── README.md             # This file
```

## 🎯 Key Features

### Interactive Visualizations

1. **Market Overview Timeline**
   - Drag or click timeline slider to explore revenue evolution (2012-2024)
   - Stacked area chart with brand-specific gradients
   - Dynamic statistics update with selected year range

2. **Global Brand Dominance Map**
   - Interactive world map showing which brand dominates each country
   - Hover over countries to see search interest data
   - Filter by brand using color-coded buttons
   - Zoom controls (+/−/reset)
   - Scroll-to-zoom disabled for better UX

3. **Category Performance Analysis**
   - Select 1-3 brands to compare
   - Line charts showing revenue trends by category
   - Bar charts displaying year-over-year category breakdown
   - Adaptive layout based on number of brands selected

4. **Vestiaire Marketplace Dashboard**
   - 4-panel linked dashboard with 62,000+ items
   - Interactive filters: brands, categories, condition, price range
   - Cross-filtering: clicking updates all views
   - Expandable panels for detailed exploration
   - Price distribution box plots (95th percentile scaling)
   - Condition breakdown stacked bars
   - Category volume donut chart
   - Price range histogram with brush selector

5. **Build Your Luxury Closet**
   - Budget slider ($500-$10,000)
   - Priority weighting system (4 metrics)
   - Smart recommendation algorithm (knapsack optimization)
   - Real-time radar chart showing closet profile
   - Budget utilization indicator
   - Scrollable product recommendations

### User Experience Features

- **Scroll-based storytelling** with snap navigation
- **Side navigation dots** for quick slide access
- **Insight lightbulbs** with key takeaways
- **Responsive design** with clamp() sizing
- **Smooth animations** and transitions
- **Custom scrollbars** with luxury gold theme
- **No slide scrolling** (only designated areas scroll)
- **Hover tooltips** throughout visualizations

## 💡 Data Insights Highlighted

- Global luxury fashion market: $473.9B (2024)
- Hermès Birkin bags can appreciate 95% in value
- Coach offers 98% accessibility vs. Hermès at 5%
- Gucci leads in versatility across product categories
- Different brands dominate in different global regions
- Resale market reveals true brand value retention

## 👥 Team

Developed for CS171 - Visualization (Fall 2024)

## 📝 Notes

- The project uses modular JavaScript files for each slide, making it easy to maintain and update
- All visualizations are rendered client-side using D3.js
- No backend server or database required
- Data is loaded asynchronously from CSV files
- Brand colors are consistently applied across all visualizations using a global constant

## 🔧 Technical Details

- **No external dependencies** beyond D3.js and TopoJSON (loaded from CDN)
- **Pure vanilla JavaScript** - no frameworks
- **CSS Grid & Flexbox** for responsive layouts
- **SVG-based visualizations** for scalability
- **Optimized for modern browsers** (ES6+ features used)

## 📄 License

This project is for educational purposes as part of CS171 coursework.