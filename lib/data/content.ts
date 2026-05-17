import type { BlogPost } from "@/types";

export const ayurvedaHeroPoints = [
  "Understand food through agni, balance, and seasonality.",
  "Translate timeless Ayurvedic ideas into everyday kitchen rituals.",
  "Discover products paired with use cases, not just ingredients.",
];

export const ayurvedaSections = [
  {
    title: "Dinacharya Essentials",
    description:
      "A daily rhythm built around digestion, nourishment, and small repeatable habits.",
    bullets: [
      "Start mornings warm with ghee, herbs, and easy digestive routines.",
      "Use seasonal fats and natural sweeteners based on your meal pattern.",
      "Anchor lunch as the heaviest meal and keep evenings lighter.",
    ],
  },
  {
    title: "Kitchen as Wellness",
    description:
      "Every pantry ingredient can support a practical outcome when paired with the right timing.",
    bullets: [
      "Ghee for nourishment and digestive comfort.",
      "Cold-pressed oils for clean everyday cooking.",
      "Raw honey for intentional sweetness without over-processing.",
    ],
  },
  {
    title: "Seasonal Balance",
    description:
      "Featured collections can be merchandised by summer cooling, monsoon resilience, and winter nourishment.",
    bullets: [
      "Cooling sweeteners and lighter meals in warmer months.",
      "Digestive support and immunity-forward staples during transitions.",
      "Richer fats and warming rituals for colder seasons.",
    ],
  },
];

export const wellnessCollections = [
  {
    title: "Daily Nourishment",
    description: "Core staples for homes that cook every day and want dependable quality.",
    href: "/products?category=ghee",
  },
  {
    title: "Digestive Comfort",
    description: "Honey, ghee, and clean pantry ingredients curated around lighter digestion.",
    href: "/products?category=wellness-essentials",
  },
  {
    title: "Ritual Bundles",
    description: "Multi-product sets designed for gifting, routines, and monthly replenishment.",
    href: "/products?category=pantry-staples",
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    slug: "why-bilona-ghee-feels-different-in-daily-food",
    title: "Why Bilona Ghee Feels Different In Daily Food",
    excerpt:
      "A practical look at cultured butter, slow simmering, and why texture and aroma matter in everyday cooking.",
    content: [
      "Bilona ghee starts with curd-set butter rather than cream, which changes both the aroma and the depth of flavor once it is slowly simmered.",
      "For families using ghee every day, the difference often shows up in how food feels after a meal: lighter, more rounded, and more satisfying.",
      "This is also why product storytelling matters. When sourcing, milk quality, and batch process are visible, trust increases alongside conversion.",
    ],
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHCuRgyOfHPUJaP3tL3VA7cbpTlA5KEChWkdEVCc7Jc1EKtVEzX0eRh8Sf2T3riJBqbC4yucHp09BlRrUGWqZLf_boK2gaao5jZSTRZgNb7EVTFceLFWxfBTklq9ry6pSsg4vsyGOpx4sAuBCMwUGKXd55EJDk7CTxVWqCmvWtHpKO4dlHJOVY2HmfRjuwGBbCtBojWk9A7dh1aI6PGYEmWvUfy-V-pWmCHY87L_-FYBqKvlRSKTYwxW9cN7Tya0baKS46bAzn73E",
    category: "Ghee",
    readTime: "4 min read",
    publishedAt: "2026-03-28",
    tags: ["bilona", "ghee", "daily cooking"],
  },
  {
    id: "blog-2",
    slug: "how-to-use-raw-honey-without-overheating-it",
    title: "How To Use Raw Honey Without Overheating It",
    excerpt:
      "Simple ways to preserve the value of raw honey while still making it part of your daily routine.",
    content: [
      "Raw honey is best treated as a finishing ingredient rather than something aggressively heated through high temperatures.",
      "In product-led education, this distinction is useful because it gives customers a direct action they can take after purchase.",
      "Use honey in warm water that is comfortable to sip, drizzle it over bowls, or pair it with herbal preparations after cooking is complete.",
    ],
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAA5Cw_pk19g9rHg583qzJ34dVFao6Dkq5PdVpj24DsGF16QFu_m-HQDOyXFHD9yRVSz7l-gNiso5-CzOMn8hgsKgk6P39QFx4lnl3BrKyeNvCyfIl1aPfmSUKmleURhZ0bCGc12erPXT4FTjR_rBl1hyOWYq7gBkC7X6OD0ZT-9XiqSbcHHN917hiY9vgfjogNIMyxpSCWmVN7uFghkOKkxTTG1ZiP2wDNy7W2P0l7eodWMAHKtLDuM9iG_f4H_XmqwEsLgMVazMw",
    category: "Honey",
    readTime: "3 min read",
    publishedAt: "2026-03-24",
    tags: ["honey", "wellness", "kitchen rituals"],
  },
  {
    id: "blog-3",
    slug: "a-simple-ayurvedic-kitchen-for-busy-homes",
    title: "A Simple Ayurvedic Kitchen For Busy Homes",
    excerpt:
      "You do not need an elaborate pantry. Start with a few honest ingredients and a clear routine.",
    content: [
      "The strongest Ayurvedic kitchens are usually not the biggest. They are consistent, simple, and built around a few ingredients used intelligently.",
      "A practical starter stack includes cultured ghee, raw honey, one reliable cold-pressed oil, and seasonal staples that your household will actually finish.",
      "That combination creates a better commerce experience too, because bundles and content all align around repeat use.",
    ],
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaepGq_V4Rpk7_wmZTMIcupSoC3x3RkEeZow4AEdBHFIIQ-1W3UM4RuxZF1q6u-5_EXWLbyjTRG9oP_Zvjno-fr0gGVvPip1zhYyaUfquWPojEX22Ai4gA4eSvWWqeK7IuTlTbkRTazlwMN0RFOsei7aa5mPhq1AeCowHi8GSgR4ElEvAc6qyM1i0ayMgwf_yKUVnOB2t-l4krpbvcSpMTf5kwHKmzk8jqYPgmiHbUkysYL1vJWoAKC374oEOxb17iBIozKlEIOiM",
    category: "Ayurveda",
    readTime: "5 min read",
    publishedAt: "2026-03-18",
    tags: ["ayurveda", "kitchen", "dinacharya"],
  },
  {
    id: "blog-4",
    slug: "cold-pressed-oils-and-what-to-cook-in-them",
    title: "Cold-Pressed Oils And What To Cook In Them",
    excerpt:
      "A customer-friendly guide to choosing oils based on taste, cooking style, and everyday use.",
    content: [
      "Cold-pressed oils are often purchased with curiosity but low confidence. Good merchandising closes that gap by explaining use, aroma, and ideal recipes.",
      "Groundnut oil works well for daily savory cooking, while sesame oil can lean more warming and expressive in regional dishes.",
      "Pairing each oil with meal ideas on the PDP helps turn browsing into decision-making faster, especially on mobile.",
    ],
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxIT35sm8zXu8nH9af7kLG7GfoXrkfXlOK3FiaLXHNlC2wP_A-YiPgu_2Dm9yukFSw8n0ifiIM399PKneG3oAOwaqsQbLEJB2FIhOQbETMrFv6y9zwvix8gaPXIcjHRTzv-umtI9bp-BB05oi8PB75K3A9YQKdqcsPDlxpYPrCObvCDP90MkH3Z_b9sgBDSgzeRwWy3xDOPsSkg1HYeHdoBU-us0tYUFoTIboAnu0_xo8w_4Eq0MQsoQ2cVer3lRhhshl_97ClQkQ",
    category: "Pantry",
    readTime: "4 min read",
    publishedAt: "2026-03-11",
    tags: ["oils", "cold pressed", "cooking"],
  },
  {
    id: "blog-5",
    slug: "seasonal-food-rituals-for-summer-balance",
    title: "Seasonal Food Rituals For Summer Balance",
    excerpt:
      "Cooling, lighter, and easier routines that keep an Ayurveda section useful rather than abstract.",
    content: [
      "Seasonal merchandising works best when customers can immediately see what changes and why it matters.",
      "For warmer weather, think lighter meals, intentional hydration, gentler sweetness, and a stronger emphasis on digestive ease.",
      "That can become a dedicated summer collection across blogs, product groupings, and homepage storytelling.",
    ],
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvYy7Qlh9EKWmT5gpg4ZdVgzNYh28BYkrzmBLa5G5uFf9fppKY6cbjQQkTMplU6GQUJLJKB3OnU3WR4M-17KIgv_osLqLzhf_L6KhncGYRdD1fCWgpQos7L64lv0KKg_4cOiPlUlxdLlKkQIcKXpkM56xVNWA6YJgcatU5-VcOMbPPAzzMpjWLZvvWEdHmcMt5xHd4RKUAD3HyO-LZgeDLG9gJ_NHHDOX2hfcvc_anjIq3LFnZSQt9gnu-IpsSOJ5srgkL1RKaeI0",
    category: "Seasonal Wellness",
    readTime: "4 min read",
    publishedAt: "2026-03-05",
    tags: ["summer", "seasonal", "ayurveda"],
  },
];
