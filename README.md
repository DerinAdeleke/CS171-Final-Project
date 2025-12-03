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

#### 1. **`vestiaire-hermès.csv`** (18,712 items)
Resale marketplace data for Hermès products from Vestiaire Collective.

**Fields Used:**
- `brand_name` (string) - Brand name (Hermès)
- `product_category` (string) - Product category (Women Clothing, Accessories, Shoes)
- `product_type` (string) - Specific product type (e.g., "Cashmere cardigan", "Birkin bag")
- `product_condition` (string) - Item condition ("Never worn", "Never worn, with tag", "Very good condition", "Good condition", "Fair condition")
- `price_usd` (float) - Resale price in USD

**Used in:** Vestiaire Marketplace Dashboard for price distribution, condition breakdown, and category volume analysis

#### 2. **`vestiaire-gucci.csv`** (41,010 items)
Resale marketplace data for Gucci products from Vestiaire Collective.

**Fields Used:**
- `brand_name` (string) - Brand name (Gucci)
- `product_category` (string) - Product category (Women Clothing, Accessories, Shoes)
- `product_type` (string) - Specific product type (e.g., "GG Marmont bag", "Ace sneakers")
- `product_condition` (string) - Item condition (same categories as Hermès)
- `price_usd` (float) - Resale price in USD

**Used in:** Vestiaire Marketplace Dashboard for cross-brand comparison and filtering

#### 3. **`vestiaire-coach.csv`** (2,265 items)
Resale marketplace data for Coach products from Vestiaire Collective.

**Fields Used:**
- `brand_name` (string) - Brand name (Coach)
- `product_category` (string) - Product category (Women Clothing, Accessories, Shoes)
- `product_type` (string) - Specific product type (e.g., "Leather crossbody", "Brooklyn tote")
- `product_condition` (string) - Item condition (same categories as other brands)
- `price_usd` (float) - Resale price in USD

**Used in:** Vestiaire Marketplace Dashboard, completing the three-brand comparison

#### 4. **`region_category_clean_data.csv`** (192 rows)
Historical revenue data by brand, region, category, and year (2012-2024).

**Fields Used:**
- `brand` (string) - Brand name (Coach, Gucci, Hermès)
- `year` (integer) - Fiscal year (2012-2024)
- `region` (string) - Geographic region ("North America", "Greater China", "Other Asia", "Other", or "NA" for category-based rows)
- `category` (string) - Product category ("Women's Handbags", "Women's Accessories", "Men's", "Other Products", or "NA" for region-based rows)
- `revenue` (float) - Revenue amount
- `millions_of_dollars` (float) - Revenue in millions of USD (converted from original currency)

**Used in:** 
- Market Overview timeline slider visualization
- Category Performance Analysis (line and bar charts)
- Revenue trend comparisons

#### 5. **`geoMap (3).csv`** (254 countries)
Google Trends search interest data showing relative brand popularity by country (2020-2025).

**Fields Used:**
- `Country` (string) - Country name
- `Coach: (11/16/20 - 11/16/25)` (string/percentage) - Search interest for Coach as percentage (e.g., "41%")
- `Gucci: (11/16/20 - 11/16/25)` (string/percentage) - Search interest for Gucci as percentage
- `Hermès: (11/16/20 - 11/16/25)` (string/percentage) - Search interest for Hermès as percentage

**Notes:** 
- Percentages represent relative search volume within each country
- Empty values indicate insufficient data
- Data spans November 2020 to November 2025

**Used in:** Global Brand Dominance world map visualization

#### 6. **`topcountriestraffic.csv`** (10 countries)
Top countries driving online luxury market traffic in 2024.

**Fields Used:**
- Column 1 (string) - Country name
- `Traffic share (%)` (float) - Percentage of global luxury e-commerce traffic
- `Traffic growth YoY (%)*` (float) - Year-over-year traffic growth percentage
- `Total visits` (string) - Visit range category (e.g., "500m-2bn", "300-499m")

**Used in:** Global Traffic Hub slide (currently hidden in presentation)

#### 7. **`best_selling_products.csv`** (15 products)
Curated selection of iconic products representing each brand's signature offerings.

**Fields Used:**
- `Brand` (string) - Brand name (Coach, Gucci, Hermès)
- `Product` (string) - Product name (e.g., "Birkin Bag", "GG Marmont Bag")
- `Price` (integer) - Retail price in USD
- `Image` (string) - Image filename for product visualization

**Used in:** Best Sellers carousel with scrolling product cards

#### 8. **`Top leading luxury brands.csv`** (10 brands)
Most valuable luxury brands worldwide in 2025 by brand value.

**Fields Used:**
- `Most valuable global luxury brands 2025` (string) - Combined field containing brand name and country (e.g., "Louis Vuitton France")
- Second column (string) - Brand value in millions USD with comma formatting (e.g., "111,938")

**Data Processing:**
- Text is split to extract brand name and country separately
- Comma-separated values are parsed to numeric format
- Top 10 brands are selected and sorted by value

**Used in:** "Did You Know?" intro slide donut chart

#### 9. **`resale_data.csv`** (9 rows)
Aggregated resale market statistics by brand and category.

**Fields Used:**
- `brand` (string) - Brand name (Coach, Gucci, Hermès)
- `category` (string) - Product category (Accessories, Apparel, Shoes)
- `count` (integer) - Number of items in resale market
- `mean` (float) - Average resale price in USD

**Used in:** Resale market overview visualizations (slide 15)

### Hardcoded Data Constants

#### 1. **Product Database** (`slides/slide18_5.js`, lines 86-146)
Curated product inventory for the "Build Your Closet" recommendation engine.

**Structure:** Array of 55 product objects (15 Coach, 20 Gucci, 20 Hermès)

**Fields per Product:**
- `brand` (string) - Brand name (Coach, Gucci, Hermès)
- `type` (string) - Product type (e.g., "Birkin 30", "GG Marmont bag", "Leather crossbody")
- `category` (string) - Product category (Accessories, Apparel, Shoes)
- `price` (integer) - Retail/resale price in USD ($45-$8,500)
- `condition` (string) - Item condition ("Never worn", "Excellent", "Very good", "Good")
- `retention` (integer) - Value retention score 0-100 (percentage of original value retained)
- `heritage` (integer) - Brand heritage score 0-100 (reflects brand history and prestige)
- `versatility` (integer) - Versatility score 0-100 (how well item pairs with other pieces)
- `accessibility` (integer) - Accessibility score 0-100 (ease of acquisition and wearability)

**Score Ranges by Brand:**
- **Coach:** Retention 22-45%, Heritage 48-55, Versatility 75-95, Accessibility 60-98
- **Gucci:** Retention 50-70%, Heritage 78-90, Versatility 70-95, Accessibility 30-80
- **Hermès:** Retention 67-95%, Heritage 98-100, Versatility 60-95, Accessibility 5-75

**Used in:** Build Your Luxury Closet tool for personalized recommendations and budget optimization

#### 2. **Timeline Data** (`slides/slide3.js`, lines 145-185)
Historical milestones charting each brand's evolution.

**Structure:** Array of 30 event objects

**Fields per Event:**
- `year` (integer) - Year of event (1837-2020)
- `brand` (string) - Brand name (Hermès, Gucci, Coach)
- `title` (string) - Event title (e.g., "Founded in Paris", "Birkin Bag")
- `description` (string) - Detailed description of the milestone

**Timeline Coverage:**
- **Hermès:** 9 events (1837-2020) - Oldest luxury house, spanning 183 years
- **Gucci:** 11 events (1921-2020) - Mid-century foundation with modern revitalization
- **Coach:** 10 events (1941-2020) - American accessible luxury story

**Key Milestones Include:**
- Brand foundations and first stores
- Iconic product launches (Kelly Bag 1956, Birkin Bag 1984, Bamboo Bag 1947)
- Creative director appointments (Tom Ford, Alessandro Michele)
- Digital transformations and sustainability commitments
- Major acquisitions and rebrandings

**Used in:** Interactive horizontal scrolling timeline visualization

#### 3. **Brand Colors** (`index.html`, lines 372-376)
Global color palette ensuring visual consistency across all visualizations.

**Structure:** JavaScript object on `window.brandColors`

**Color Mappings:**
- **Hermès:** `#8B2635` (Deep burgundy/maroon - reflects heritage and exclusivity)
- **Gucci:** `#d4af37` (Metallic gold - represents luxury and Italian craftsmanship)
- **Coach:** `#8b4513` (Saddle brown - evokes leather goods and American craftsmanship)

**Used in:**
- All D3 visualizations for brand-specific elements
- Filter buttons and interactive controls
- Chart legends and data points
- Map country fills
- Timeline event markers
- Product cards and category indicators

**Design Rationale:**
- Colors chosen to reflect each brand's identity and heritage
- High contrast for accessibility and readability
- Consistent across all 20+ slides and visualizations
- Referenced via `window.brandColors[brandName]` throughout codebase

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