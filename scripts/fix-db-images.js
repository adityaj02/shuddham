require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixImages() {
  console.log('🚀 Starting Supabase image path update...');

  // 1. Update Categories
  const categories = [
    { slug: 'immunity-health', image: '/assets/images/Screenshot 2026-04-09 224849.png' },
    { slug: 'mental-wellness', image: '/assets/images/Screenshot 2026-04-09 224750.png' },
    { slug: 'skin-beauty', image: '/assets/images/Screenshot 2026-04-09 224936.png' },
    { slug: 'herbal-teas', image: '/assets/images/Screenshot 2026-04-09 224826.png' }
  ];

  for (const cat of categories) {
    const { error } = await supabase
      .from('categories')
      .update({ image: cat.image })
      .eq('slug', cat.slug);
    
    if (error) console.error(`❌ Error updating category ${cat.slug}:`, error.message);
    else console.log(`✅ Updated category: ${cat.slug}`);
  }

  // 2. Update Products
  const products = [
    { slug: 'brahmi-leaf-powder', images: ['/assets/images/Screenshot 2026-04-09 224750.png'] },
    { slug: 'tulsi-green-tea', images: ['/assets/images/Screenshot 2026-04-09 224826.png'] },
    { slug: 'calm-mind-capsules', images: ['/assets/images/Screenshot 2026-04-09 224837.png'] },
    { slug: 'tulsi-immunity-drops', images: ['/assets/images/Screenshot 2026-04-09 224849.png'] },
    { slug: 'shankhpushpi-syrup', images: ['/assets/images/Screenshot 2026-04-09 224902.png'] },
    { slug: 'neem-purifying-mask', images: ['/assets/images/Screenshot 2026-04-09 224913.png'] },
    { slug: 'amla-vitamin-c', images: ['/assets/images/Screenshot 2026-04-09 224924.png'] },
    { slug: 'saffron-glow-face-oil', images: ['/assets/images/Screenshot 2026-04-09 224936.png'] },
    { slug: 'chamomile-dream-tea', images: ['/assets/images/Screenshot 2026-04-09 224954.png'] },
    { slug: 'turmeric-golden-milk', images: ['/assets/images/Screenshot 2026-04-09 225004.png'] },
    { slug: 'ashwagandha-root-powder', images: ['/assets/images/Screenshot 2026-04-09 225016.png'] },
    { slug: 'aloe-vera-gel', images: ['/assets/images/Screenshot 2026-04-09 225029.png'] }
  ];

  for (const prod of products) {
    const { error } = await supabase
      .from('products')
      .update({ images: prod.images })
      .eq('slug', prod.slug);
    
    if (error) console.error(`❌ Error updating product ${prod.slug}:`, error.message);
    else console.log(`✅ Updated product: ${prod.slug}`);
  }

  console.log('🎉 Done!');
}

fixImages();
