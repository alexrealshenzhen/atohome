'use strict';

// 统一内容配置：修改文案、图片和商品后刷新页面，无需构建。
// 保留字段名、商品 ID 和占位符；{brand} 引用 brand.name，其余由交互提供。
window.SITE_CONFIG = {
  "brand": {
    "name": "atohome"
  },
  "meta": {
    "language": "en",
    "title": "{brand} — A Little More Comfort, Every Day",
    "description": "Discover a more comfortable home with {brand} air purifiers, humidifiers, vacuums and fans. An independently built storefront preview."
  },
  "format": {
    "locale": "en-US",
    "currency": "USD"
  },
  "media": {
    "airHero": "assets/air-hero.webp",
    "allergySolution": "assets/allergy-solution.webp",
    "appHealth": "assets/app-health.webp",
    "appHome": "assets/app-home.webp",
    "appRecipe": "assets/app-recipe.webp",
    "atohomeLogoLight": "assets/atohome-logo-light.svg",
    "atohomeLogo": "assets/atohome-logo.svg",
    "blackFriday": "assets/black-friday.webp",
    "categoryAir": "assets/category-air.webp",
    "categoryFan": "assets/category-fan.webp",
    "categoryFilter": "assets/category-filter.webp",
    "categoryHumidifier": "assets/category-humidifier.webp",
    "categoryVacuum": "assets/category-vacuum.webp",
    "favicon": "assets/favicon.svg",
    "holidayHero": "assets/holiday-hero.webp",
    "holidayMobile": "assets/holiday-mobile.webp",
    "humidifierHero": "assets/humidifier-hero.webp",
    "livingRoom": "assets/living-room.webp",
    "petHero": "assets/pet-hero.webp",
    "petSolution": "assets/pet-solution.webp",
    "productCore": "assets/product-core.webp",
    "productHumidifier": "assets/product-humidifier.webp",
    "productMini": "assets/product-mini.webp",
    "productVacuum": "assets/product-vacuum.webp",
    "productVital": "assets/product-vital.webp",
    "saleBanner": "assets/sale-banner.webp",
    "sleepSolution": "assets/sleep-solution.webp",
    "techFilter": "assets/tech-filter.webp",
    "techQuiet": "assets/tech-quiet.webp",
    "techSmart": "assets/tech-smart.webp",
    "techVacuum": "assets/tech-vacuum.webp",
    "jh02": "assets/jh02.webp",
    "jh05": "assets/jh05.webp",
    "jh06": "assets/jh06.webp",
    "jh08": "assets/jh08.webp"
  },
  "categories": {
    "all": "Shop All",
    "air": "Air Purifiers",
    "vacuums": "Vacuums",
    "humidifiers": "Humidifiers",
    "fans": "Fans",
    "filters": "Filters & Accessories",
    "favorites": "Your Favorites"
  },
  "featuredProducts": [
    "jh02",
    "jh05",
    "jh06",
    "jh08"
  ],
  "products": [
    {
      "id": "jh02",
      "name": "JH02 Air Purifier",
      "category": "air",
      "image": "jh02",
      "price": null,
      "regular": null,
      "rating": null,
      "reviews": null,
      "badge": "100 m³/h CADR",
      "summary": "20–35 m² · Three airflow modes",
      "description": "Designed for everyday air care in 20–35 m² rooms, the JH02 combines a CADR of 100 m³/h with three selectable airflow modes and flexible timer settings.",
      "specifications": [
        {
          "label": "CADR",
          "value": "100 m³/h"
        },
        {
          "label": "Applicable area",
          "value": "20–35 m²"
        },
        {
          "label": "Rated voltage",
          "value": "AC 220–240 V, 50 Hz"
        },
        {
          "label": "Maximum power",
          "value": "35 W"
        },
        {
          "label": "Product dimensions",
          "value": "330 × 180 × 560 mm"
        },
        {
          "label": "Net weight",
          "value": "2.78 kg"
        },
        {
          "label": "Package dimensions",
          "value": "370 × 215 × 605 mm"
        },
        {
          "label": "Gross weight",
          "value": "3.3 kg"
        }
      ],
      "features": [
        "Sleep mode for slower airflow; Purify mode for medium airflow; Smoke Free mode for high airflow.",
        "Timer options: 1, 2, 8 or 12 hours.",
        "Negative-ion function is optional."
      ]
    },
    {
      "id": "jh05",
      "name": "JH05 Air Purifier",
      "category": "air",
      "image": "jh05",
      "price": null,
      "regular": null,
      "rating": null,
      "reviews": null,
      "badge": "150 m³/h CADR",
      "summary": "30–50 m² · H11 HEPA filtration",
      "description": "The JH05 pairs a CADR of 150 m³/h with three-stage pre-filter, H11 HEPA and activated-carbon filtration. Air-quality monitoring and a temperature display help you keep track of the room.",
      "specifications": [
        {
          "label": "CADR",
          "value": "150 m³/h"
        },
        {
          "label": "Applicable area",
          "value": "30–50 m²"
        },
        {
          "label": "Rated voltage",
          "value": "AC 220–240 V, 50 Hz"
        },
        {
          "label": "Maximum power",
          "value": "≤35 W"
        },
        {
          "label": "Color",
          "value": "White"
        },
        {
          "label": "Product dimensions",
          "value": "330 × 180 × 560 mm"
        },
        {
          "label": "Net weight",
          "value": "3 kg"
        },
        {
          "label": "Package dimensions",
          "value": "370 × 215 × 605 mm"
        },
        {
          "label": "Gross weight",
          "value": "3.52 kg"
        }
      ],
      "features": [
        "Three-stage pre-filter, H11 HEPA and activated-carbon filtration.",
        "Sleep, middle and high fan speeds.",
        "Timer: 1–8 hours.",
        "Filter-replacement reminder after 2,000 hours.",
        "Real-time air-quality monitoring and temperature display.",
        "Negative-ion and UV functions are optional."
      ]
    },
    {
      "id": "jh06",
      "name": "JH06 Air Purifier",
      "category": "air",
      "image": "jh06",
      "price": null,
      "regular": null,
      "rating": null,
      "reviews": null,
      "badge": "300 m³/h CADR",
      "summary": "30–50 m² · PM2.5 monitoring",
      "description": "With a CADR of 300 m³/h, the JH06 brings H11 HEPA filtration and real-time PM2.5 monitoring to 30–50 m² rooms. Three fan speeds, a temperature display and timed operation provide everyday control.",
      "specifications": [
        {
          "label": "CADR",
          "value": "300 m³/h"
        },
        {
          "label": "Applicable area",
          "value": "30–50 m²"
        },
        {
          "label": "Rated voltage",
          "value": "AC 220–240 V, 50 Hz"
        },
        {
          "label": "Maximum power",
          "value": "≤40 W"
        },
        {
          "label": "Maximum noise",
          "value": "≤35 dB"
        },
        {
          "label": "Material / color",
          "value": "ABS / white"
        },
        {
          "label": "Product dimensions",
          "value": "330 × 200 × 630 mm"
        },
        {
          "label": "Net weight",
          "value": "4.5 kg"
        },
        {
          "label": "Package dimensions",
          "value": "375 × 238 × 670 mm"
        },
        {
          "label": "Gross weight",
          "value": "5.1 kg"
        }
      ],
      "features": [
        "Three-stage pre-filter, H11 HEPA and activated-carbon filtration.",
        "Sleep, middle and high fan speeds.",
        "Timer: 1–8 hours.",
        "Real-time PM2.5 monitoring and temperature display.",
        "Filter-replacement reminder after 2,000 hours.",
        "Negative-ion function included; UV function optional."
      ]
    },
    {
      "id": "jh08",
      "name": "JH08 Air Purifier",
      "category": "air",
      "image": "jh08",
      "price": null,
      "regular": null,
      "rating": null,
      "reviews": null,
      "badge": "160 m³/h CADR",
      "summary": "40–50 m² · H11 HEPA filtration",
      "description": "The JH08 combines a CADR of 160 m³/h with three-stage H11 HEPA filtration for 40–50 m² rooms. Real-time PM2.5 monitoring, a temperature display and three fan speeds keep room air care easy to manage.",
      "specifications": [
        {
          "label": "CADR",
          "value": "160 m³/h"
        },
        {
          "label": "Applicable area",
          "value": "40–50 m²"
        },
        {
          "label": "Rated voltage",
          "value": "220–240 V"
        },
        {
          "label": "Maximum power",
          "value": "≤35 W"
        },
        {
          "label": "Maximum noise",
          "value": "≤35 dB"
        },
        {
          "label": "Material / color",
          "value": "ABS / white"
        },
        {
          "label": "Product dimensions",
          "value": "330 × 200 × 515 mm"
        },
        {
          "label": "Net weight",
          "value": "3.8 kg"
        },
        {
          "label": "Package dimensions",
          "value": "375 × 238 × 565 mm"
        },
        {
          "label": "Gross weight",
          "value": "4.7 kg"
        }
      ],
      "features": [
        "Three-stage pre-filter, H11 HEPA and activated-carbon filtration.",
        "Sleep, middle and high fan speeds.",
        "Timer: 1–8 hours.",
        "Real-time PM2.5 monitoring and temperature display.",
        "Filter-replacement reminder after 2,000 hours.",
        "Negative-ion and UV functions are optional."
      ]
    },
    {
      "id": "vital-200s",
      "name": "Vital 200S-P Smart Air Purifier",
      "category": "air",
      "image": "productVital",
      "price": 159.99,
      "regular": 189.99,
      "rating": "4.8",
      "reviews": "2,640",
      "badge": "Bestseller",
      "description": "A fresh start for pet-friendly homes. The Vital 200S-P captures pet hair, dander, and everyday airborne particles, with smart control that makes cleaner air feel effortless.",
      "summary": "",
      "specifications": [],
      "features": []
    },
    {
      "id": "lvac-200",
      "name": "LVAC-200 Cordless Vacuum Cleaner",
      "category": "vacuums",
      "image": "productVacuum",
      "price": 139.99,
      "regular": 199.99,
      "rating": "4.7",
      "reviews": "1,820",
      "badge": "Save $60",
      "description": "Lightweight, powerful, and ready for real life. Make quick work of everyday crumbs and pet hair with cordless freedom, versatile attachments, and an easy-empty dustbin.",
      "summary": "",
      "specifications": [],
      "features": []
    },
    {
      "id": "core-300",
      "name": "Core® 300-P Air Purifier",
      "category": "air",
      "image": "productCore",
      "price": 80.99,
      "regular": 99.99,
      "rating": "4.8",
      "reviews": "3,210",
      "badge": "Fan Favorite",
      "description": "Your everyday clean-air companion. A compact design and whisper-quiet operation bring fresh air to bedrooms, home offices, and the spaces you love most.",
      "summary": "",
      "specifications": [],
      "features": []
    },
    {
      "id": "core-mini",
      "name": "Core® Mini-P Air Purifier",
      "category": "air",
      "image": "productMini",
      "price": 39.99,
      "regular": 49.99,
      "rating": "4.7",
      "reviews": "1,960",
      "badge": "Small & Mighty",
      "description": "Big comfort for little spaces. This personal air purifier fits right into your nightstand or workspace, with simple controls and a compact footprint.",
      "summary": "",
      "specifications": [],
      "features": []
    },
    {
      "id": "lv600s",
      "name": "LV600S Smart Hybrid Humidifier",
      "category": "humidifiers",
      "image": "productHumidifier",
      "price": 98.99,
      "regular": 109.99,
      "rating": "4.6",
      "reviews": "1,140",
      "badge": "Winter Essential",
      "description": "Find your ideal balance with warm and cool mist, smart humidity control, and a generous water tank. A simple way to make dry days a little more comfortable.",
      "summary": "",
      "specifications": [],
      "features": []
    },
    {
      "id": "superior-studio",
      "name": "Superior® Studio Smart Humidifier",
      "category": "humidifiers",
      "image": "categoryHumidifier",
      "price": 129.99,
      "regular": 149.99,
      "rating": "4.8",
      "reviews": "324",
      "badge": "New Arrival",
      "description": "Meet natural humidification, made smart. Evaporative technology helps balance dry air without visible mist or white dust, in a design that feels at home anywhere.",
      "summary": "",
      "specifications": [],
      "features": []
    },
    {
      "id": "windi-mini",
      "name": "Windi Mini Portable Desk Fan",
      "category": "fans",
      "image": "categoryFan",
      "price": 39.99,
      "regular": 49.99,
      "rating": "4.7",
      "reviews": "286",
      "badge": "A Fresh Breeze",
      "description": "Your perfect little breeze, wherever the day takes you. A portable desk companion with a compact design and easy controls for personalized comfort.",
      "summary": "",
      "specifications": [],
      "features": []
    },
    {
      "id": "eleva-filter",
      "name": "Eleva™ 300X Replacement Filter",
      "category": "filters",
      "image": "categoryFilter",
      "price": 39.99,
      "regular": 49.99,
      "rating": "4.9",
      "reviews": "168",
      "badge": "Genuine {brand}",
      "description": "Keep your fresh-air routine going. A genuine {brand} replacement filter designed for the Eleva 300X, with a snug fit and straightforward installation.",
      "summary": "",
      "specifications": [],
      "features": []
    },
    {
      "id": "eleva-300x",
      "name": "Eleva™ 300X Smart Air Purifier",
      "category": "air",
      "image": "categoryAir",
      "price": 199.99,
      "regular": 249.99,
      "rating": "4.8",
      "reviews": "426",
      "badge": "Smart Comfort",
      "description": "Thoughtful air care for your everyday. Advanced filtration and smart sensing come together in a refined design, giving your home a little more peace of mind.",
      "summary": "",
      "specifications": [],
      "features": []
    },
    {
      "id": "vortexiq-pro",
      "name": "VortexIQ® Pro Cordless Vacuum",
      "category": "vacuums",
      "image": "categoryVacuum",
      "price": 249.99,
      "regular": 299.99,
      "rating": "4.7",
      "reviews": "392",
      "badge": "Powerfully Simple",
      "description": "From the first crumb to the last corner, enjoy powerful cordless cleaning with a versatile design that moves easily between floors and everyday messes.",
      "summary": "",
      "specifications": [],
      "features": []
    }
  ],
  "promotion": {
    "endsAt": "2026-12-01T00:00:00-08:00",
    "expired": {
      "title": "More Comfort. Every Season.",
      "description": "The Black Friday event has ended. Explore everyday essentials for a more comfortable home.",
      "action": "Explore the Collection"
    }
  },
  "technology": {
    "images": [
      {
        "image": "techFilter",
        "alt": "Replacing a {brand} air purifier filter"
      },
      {
        "image": "techVacuum",
        "alt": "{brand} hands-free auto-empty vacuum technology"
      },
      {
        "image": "techQuiet",
        "alt": "{brand} quiet operation technology for a peaceful home"
      },
      {
        "image": "techSmart",
        "alt": "Smart home control with the VeSync app"
      }
    ]
  },
  "info": {
    "support": {
      "title": "{brand} Support",
      "copy": "This storefront preview does not have a connected support service. Contact details can be added when the {brand} store launches."
    },
    "about": {
      "title": "About {brand}",
      "copy": "A little more comfort, every day. Explore the {brand} storefront preview to discover air care and home essentials."
    },
    "manuals": {
      "title": "{brand} User Manuals",
      "copy": "Product manuals have not been added to this storefront preview."
    },
    "social": {
      "title": "Connect with {brand}",
      "copy": "Social profiles for {brand} have not been connected to this storefront preview."
    },
    "regions": {
      "title": "{brand} Around the World",
      "copy": "Regional storefronts for {brand} have not been connected to this preview."
    },
    "account": {
      "title": "Make yourself at home.",
      "copy": "This is an independent storefront preview. Account sign-in is not connected. You can explore products, save favorites, and keep a shopping bag in this browser."
    },
    "shipping": {
      "title": "A little more peace of mind.",
      "copy": "The reference store advertises free shipping on eligible orders. This preview does not accept orders or calculate shipping. Shipping policies for {brand} have not been configured in this preview."
    },
    "returns": {
      "title": "Comfort, with confidence.",
      "copy": "The reference store advertises a 2-year limited warranty and 30-day returns. This preview does not process purchases or returns. Returns and warranty policies for {brand} have not been configured in this preview."
    },
    "privacy": {
      "title": "Your privacy matters.",
      "copy": "This independent preview has no analytics or tracking scripts. Your shopping bag and favorites are stored only in this browser. Email addresses are not collected or submitted. Links to official sites open those sites with their own privacy policies."
    },
    "terms": {
      "title": "About this storefront preview.",
      "copy": "This is an independent recreation of the {brand} homepage for demonstration. Brand names, product images, and reference copy belong to their respective owners. Product prices, ratings, and availability are illustrative and may change. No purchases, accounts, or email subscriptions are processed here."
    }
  },
  "links": {
    "cosori": "https://cosori.com/",
    "etekcity": "https://etekcity.com/",
    "vesync": "https://vesync.com/"
  },
  "ui": {
    "shared": {
      "terms": "Terms of Use",
      "privacy": "Privacy Policy",
      "emailLabel": "Email address",
      "emailPlaceholder": "Enter your email address",
      "subscribe": "Subscribe",
      "homeLabel": "{brand} home"
    },
    "navigation": {
      "open": "Open navigation",
      "close": "Close navigation"
    },
    "product": {
      "favoriteAdd": "Save {name} to favorites",
      "favoriteRemove": "Remove {name} from favorites",
      "view": "View {name}",
      "imageAlt": "{name}",
      "ratingLabel": "Rated {rating} out of 5, ",
      "stars": "★★★★★",
      "ratingSummary": "{rating} ({reviews})",
      "add": "Add to Bag",
      "addLabel": "Add {name} to bag",
      "detailRating": " {rating} · {reviews} reviews",
      "benefits": " Free shipping · 2-year warranty · 30-day returns",
      "details": "View Details",
      "specifications": "Specifications",
      "features": "Features"
    },
    "shop": {
      "oneResult": "{count} product",
      "manyResults": "{count} products",
      "searchSuffix": " found",
      "browseSuffix": " to make yourself at home"
    },
    "cart": {
      "dialogLabel": "Your shopping bag",
      "openOne": "Open shopping bag, {count} item",
      "openMany": "Open shopping bag, {count} items",
      "quantity": "({count})",
      "emptyTitle": "A little room for comfort.",
      "emptyDescription": "Your bag is empty. Let’s find your new favorite.",
      "emptyAction": "Explore the Collection",
      "decrease": "Decrease quantity of {name}",
      "increase": "Increase quantity of {name}",
      "quantityLabel": "Quantity",
      "remove": "Remove",
      "removeLabel": "Remove {name}"
    },
    "feedback": {
      "restoreFailed": "Saved bag could not be loaded. A new bag is ready for this visit.",
      "saveFailed": "Your browser could not save this bag. It is available for this visit only.",
      "quantityLimit": "You can add up to {limit} of each item.",
      "added": "{name} added to your bag",
      "favoriteRemoved": "Removed from your favorites.",
      "favoriteSaved": "Saved to your favorites. Find it under View All → Favorites.",
      "subscription": "This is a storefront preview. Your email has not been collected or submitted."
    },
    "slideshow": {
      "playLabel": "Play slideshow",
      "pauseLabel": "Pause slideshow",
      "playSymbol": "▷",
      "pauseSymbol": "Ⅱ",
      "position": "{index} of {total}",
      "total": " / {slideCount}"
    },
    "accordion": {
      "expanded": "−",
      "collapsed": "+"
    }
  },
  "copy": {
    "common": {
      "link": "Skip to content"
    },
    "announcement": {
      "label": "Our Holiday Bundles are here: ",
      "label2": "Shop Now",
      "label3": "Explore brands:",
      "link": "cosori",
      "link2": "etekcity",
      "link3": "VeSync",
      "supportAction": "Support"
    },
    "navigation": {
      "exploreToggle": "Explore ",
      "label": "Pet-Friendly Homes",
      "note": "A fresh start for you and your pets.",
      "label2": "Allergy Defense",
      "note2": "Make room for easier breathing.",
      "label3": "Better Night",
      "note3": "Find comfort in your everyday.",
      "link": "Learn ",
      "label4": "Search...",
      "airAction": "Air Purifiers ",
      "label5": "→",
      "humidifiersAction": "Humidifiers ",
      "vacuumsAction": "Vacuums ",
      "fansAction": "Fans ",
      "filtersAction": "Filters & Accessories ",
      "link2": "Find Your Air Solution",
      "link3": "Discover Our Technology",
      "supportAction": "Support ↗",
      "desktopNavAriaLabel": "Main navigation",
      "actionAriaLabel": "Search products",
      "accountActionAriaLabel": "Account information",
      "mobileMenuAriaLabel": "Mobile navigation"
    },
    "hero": {
      "slides": [
        {
          "eyebrow": "A LITTLE MORE COMFORT. A LOT MORE JOY.",
          "title": "Exclusive",
          "title2": "Holiday Bundles",
          "description": "The perfect gift for every wishlist, now at the best prices of the season.",
          "allAction": "Shop Exclusives ",
          "holidayHeroImageAlt": "{brand} air purifier and cordless vacuum in a cozy holiday living room with a blue armchair and wrapped gifts"
        },
        {
          "eyebrow": "BLACK FRIDAY · NOV 17–30",
          "title": "Big Savings.",
          "title2": "A Cozier Home.",
          "description": "Refresh your space for less with Black Friday deals on your {brand} favorites.",
          "allAction": "Shop Black Friday ",
          "blackFridayImageAlt": "{brand} air care and floor care essentials for Black Friday"
        },
        {
          "eyebrow": "A FRESHER HOME. A HAPPIER PACK.",
          "title": "The Partnership",
          "title2": "for Pet People",
          "description": "Less pet hair. More best-friend time.",
          "link": "Find Your Solution ",
          "petHeroImageAlt": "A golden retriever relaxing beside {brand} home essentials"
        },
        {
          "eyebrow": "{brand} SUPERIOR® STUDIO SMART",
          "title": "A Natural Way",
          "title2": "to Feel Better.",
          "description": "No mist. No white dust. Just balanced, comfortable air.",
          "humidifiersAction": "Shop Humidifiers ",
          "humidifierHeroImageAlt": "{brand} Superior Studio humidifier in a peaceful sunlit room"
        },
        {
          "eyebrow": "MEET THE {brand} ELEVA™ 500X",
          "title": "Fresh Air.",
          "title2": "Room to Thrive.",
          "description": "Advanced allergen defense, from the front door to the family room.",
          "airAction": "Explore Air Purifiers ",
          "airHeroImageAlt": "{brand} Eleva 500X in a family living room"
        }
      ],
      "controls": {
        "heroCaption": "Made for the moments at home.",
        "heroAriaLabel": "Featured collections",
        "heroAriaRoledescription": "carousel",
        "actionAriaLabel": "Show holiday bundles",
        "actionAriaLabel2": "Show Black Friday",
        "actionAriaLabel3": "Show pet collection",
        "actionAriaLabel4": "Show humidifiers",
        "actionAriaLabel5": "Show air purifiers"
      }
    },
    "introduction": {
      "eyebrow": "WELCOME TO A BETTER EVERYDAY",
      "title": "A Peaceful Home Starts",
      "title2": "With the Fresh Air Inside It",
      "description": "Everyday activities can release unseen particles that impact your sleep and comfort at home.",
      "description2": "Captures particles as small as 0.3 microns",
      "description3": "Filters and recirculates air continuously",
      "description4": "Monitors real-time indoor air quality",
      "livingRoomImageAlt": "A white dog sleeping comfortably beside an air purifier in a sunlit living room"
    },
    "promotion": {
      "label": "days",
      "label2": ":",
      "label3": "hours",
      "label4": "minutes",
      "label5": "seconds",
      "title": "Black Friday Savings Are On",
      "description": "Make room for more comfort. Shop {brand} favorites for less,",
      "description2": "with more deals arriving through Nov 30.",
      "allAction": "Shop Black Friday ",
      "countdownAriaLabel": "Time remaining in Black Friday promotion"
    },
    "solutions": {
      "eyebrow": "YOUR HOME. YOUR KIND OF COMFORT.",
      "title": "Find Your Perfect",
      "title2": "Air Solution",
      "items": [
        {
          "title": "For Pet Owners",
          "benefit": "Reduce dander, hair, and fur",
          "benefit2": "Freshens the air for you and your pets",
          "benefit3": "Helps eliminate pet odors",
          "airAction": "Shop for Pet Owners ",
          "petSolutionImageAlt": "A pet owner and golden retriever in a fresh, welcoming home"
        },
        {
          "title": "For Allergens",
          "benefit": "Filters seasonal pollen",
          "benefit2": "Captures microscopic dust",
          "benefit3": "Helps reduce airborne allergens",
          "airAction": "Shop Allergen Defense ",
          "allergySolutionImageAlt": "An air purifier beside a bright bedroom window"
        },
        {
          "title": "For Better Night",
          "benefit": "White noise for soothing spaces",
          "benefit2": "Optimal humidity to balance dry air",
          "benefit3": "Filters airborne allergens and dust",
          "humidifiersAction": "Shop Comfort Solutions ",
          "sleepSolutionImageAlt": "A quiet blue bedroom with a {brand} purifier beside the bed"
        }
      ]
    },
    "categories": {
      "title": "Shop by Category",
      "allAction": "Shop all ",
      "label": "Air Purifiers ",
      "label2": "Vacuums ",
      "label3": "Humidifiers ",
      "label4": "Fans ",
      "label5": "Filters ",
      "categoryAirImageAlt": "",
      "categoryVacuumImageAlt": "",
      "categoryHumidifierImageAlt": "",
      "categoryFanImageAlt": "",
      "categoryFilterImageAlt": ""
    },
    "technology": {
      "eyebrow": "THOUGHTFULLY ENGINEERED",
      "title": "Advanced Technology",
      "items": [
        {
          "action": "Filtration Technology ",
          "description": "Captures microscopic particles that linger in the air."
        },
        {
          "action": "HyperPulse™ Auto-Empty Tech ",
          "description": "Hands-free sealed dust disposal to eliminate dust clouds."
        },
        {
          "action": "QuietKEAP Technology™ ",
          "description": "Whisper-quiet operation for 24/7 use, even while you sleep."
        },
        {
          "action": "VeSync Smart Control ",
          "description": "Alexa® and Google® voice compatible with remote app control."
        }
      ]
    },
    "ecosystem": {
      "eyebrow": "A CONNECTED HOME. A BETTER YOU.",
      "title": "Experience the VeSync Difference",
      "description": "One app. Three brands. Unlimited wellness possibilities. Trusted since 2011.",
      "value": "14M",
      "description2": "Global Users",
      "description3": "Devices Connected",
      "value2": "30",
      "description4": "Countries Worldwide",
      "label": "cosori",
      "label2": "etekcity"
    },
    "newsletter": {
      "eyebrow": "GOOD THINGS, STRAIGHT TO YOUR INBOX",
      "title": "Stay Informed",
      "description": "Get expert tips, product updates, and exclusive offers from {brand} straight to your inbox.",
      "action": "Subscribe ",
      "note": "By subscribing you agree to our ",
      "note2": " and ",
      "note3": "."
    },
    "app": {
      "eyebrow": "YOUR EVERYDAY, CONNECTED",
      "title": "An Entire Ecosystem",
      "title2": "in One Single App",
      "link": "Explore VeSync ",
      "value": "4.7 ",
      "label": "/ 5",
      "note": "Little changes. A better everyday.",
      "appPill": " A little more connected.",
      "starsAriaLabel": "Rated 4.7 out of 5",
      "appVisualAriaLabel": "VeSync app previews",
      "appRecipeImageAlt": "Recipes and cooking controls in the VeSync app",
      "appHomeImageAlt": "Smart home devices in the VeSync app",
      "appHealthImageAlt": "Personal wellness insights in the VeSync app"
    },
    "trending": {
      "eyebrow": "LOVED IN HOMES LIKE YOURS",
      "title": "Trending Products",
      "allAction": "View All ",
      "label": " Free shipping",
      "label2": " 2-year limited warranty",
      "label3": " 30-day money-back guarantee"
    },
    "footer": {
      "newsletter": {
        "title": "Get the Latest News",
        "title2": "From {brand}",
        "description": "Join our email list for updates, exclusive offers, and tips delivered straight to your inbox.",
        "action": "Subscribe ",
        "note": "By subscribing you agree to our ",
        "note2": " and ",
        "note3": "."
      },
      "brand": {
        "description": "Make yourself at home.",
        "socialAction": "◎",
        "socialAction2": "f",
        "socialAction3": "♪",
        "socialAction4": "▷",
        "note": "Visit our official websites",
        "regionsAction": "UK ↗",
        "regionsAction2": "DE ↗",
        "regionsAction3": "FR ↗",
        "regionsAction4": "ES ↗",
        "socialActionAriaLabel": "{brand} on Instagram",
        "socialActionAriaLabel2": "{brand} on Facebook",
        "socialActionAriaLabel3": "{brand} on TikTok",
        "socialActionAriaLabel4": "{brand} on YouTube"
      },
      "columns": [
        {
          "fansAction": "Tower Fans",
          "filtersAction": "Accessories",
          "link": "Sales"
        },
        {
          "title": "Our Brands",
          "link": "Cosori ↗",
          "link2": "Etekcity ↗"
        },
        {
          "title": "Our Company",
          "aboutAction": "About {brand}",
          "link": "Learning Hub ↗",
          "link2": "Our Technology",
          "link3": "VeSync App"
        },
        {
          "title": "Explore",
          "link": "For Pet Owners",
          "link2": "For Allergens",
          "link3": "For Better Rest",
          "allAction": "Find Your Favorites"
        },
        {
          "title": "Help Center",
          "supportAction": "Contact Support ↗",
          "shippingAction": "Shipping & Delivery",
          "returnsAction": "Returns & Warranty",
          "manualsAction": "User Manuals ↗"
        }
      ],
      "legal": {
        "note": "© 2026 {brand}. Independent website recreation.",
        "label": "United States · English"
      }
    },
    "shop": {
      "eyebrow": "FIND YOUR EVERYDAY ESSENTIALS",
      "label": "Search products",
      "action": "All Products",
      "action2": "Filters",
      "action3": "Favorites ♡",
      "description": "No matches just yet. Try another search or category.",
      "actionAriaLabel": "Close shop",
      "productSearchPlaceholder": "Search air purifiers, humidifiers, and more…",
      "filterTabsAriaLabel": "Product category"
    },
    "cart": {
      "title": "Your Bag ",
      "label": "Subtotal",
      "description": "Free shipping. Taxes calculated at checkout.",
      "checkoutButton": "Continue to Checkout ",
      "checkoutNote": "This is a storefront preview. Checkout is not connected and no payment will be collected.",
      "cartAssurance": " A little more peace of mind. Always.",
      "actionAriaLabel": "Close shopping bag"
    },
    "information": {
      "eyebrow": "A LITTLE MORE INFORMATION",
      "action": "Got it ",
      "actionAriaLabel": "Close information"
    },
    "product": {
      "actionAriaLabel": "Close product details"
    }
  }
};
