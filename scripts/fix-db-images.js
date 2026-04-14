const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ecabuuvkflrooahoqfxz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjYWJ1dXZrZmxyb29haG9xZnh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTU0MTQxMCwiZXhwIjoyMDkxMTE3NDEwfQ.C2347FYuvl4PWHgqfpzBwY0gtixzRgghf95qL2fmXqY';

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
