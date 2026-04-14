export const siteConfig = {
  name: "SHUDDHAM",
  shortName: "SHUDDHAM",
  description:
    "Doctor-verified, 100% natural Ayurvedic formulations for modern daily rituals.",
  supportEmail: "care@shuddham.com",
  whatsappNumber: "+919876543210",
};

export const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Wisdom", href: "/blogs" },
  { label: "Dashboard", href: "/dashboard" },
];

export const trustSeals = [
  { icon: "verified_user", label: "Doctor Verified" },
  { icon: "eco", label: "100% Natural" },
  { icon: "history_edu", label: "Ayurvedic Tradition" },
];

export const guidedShoppingOptions = [
  { icon: "flare", label: "Radiance" },
  { icon: "nights_stay", label: "Better Sleep" },
  { icon: "self_improvement", label: "Daily Calm" },
  { icon: "bolt", label: "Vitality" },
];

export const shopByConcern = [
  {
    title: "Restorative Sleep",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_hj0t10181gtoj0JEpkqcTm-zYW0dwpnNosqQvkz_2hHN3qoBWQCD6xRkxl50HvvQ-wq8SfGUiWUd8YMBdvrYamMrFO7cF0jLkXipbezNAQ2krJCqPh8Hamk2BleuPEzX1uCJzRFFfNy0KhLmFMpY2q14LxuvxQoyRjv7b8JbDU5s0SfPkw0jhym4iqnd2r0ogpxNHfnlbZL4VBJK44hoxIQPCWHhU_9mNTY8piVWuvvbtFXkSxHRhWgcyDISX4CATEyU_aawf64",
    span: "col-span-2 md:col-span-2 row-span-2",
    size: "large",
    href: "/products?concern=sleep",
  },
  {
    title: "Skin",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCn4yD70fK7H32Dgeiv7nH52TkmJH44c3MxKXQcJs2yXKinaz-z-8ebjvTKtHwcNYFZK5OTegfPNICyirqyDKxaLo_agLvTcsXGPZzMKIx_EmLqknrBBiuejN-9luHJxQKFRIHSrR2i0JqW0LrM-umIgncSQuVevbQ6cHzV0V9NLovoG-rwqmJtAs42PwaD1UjAn783DwOR90v6X6K6XNwQYxIcvegO5EM1FGKlEjJrHZkxeiqSbyZOIvqVpocGit_4R6Xtqi5VFzg",
    span: "row-span-1",
    size: "small",
    href: "/products?concern=skin",
  },
  {
    title: "Digestion",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_uMGEmlodUc7fVKnzJFSY0Gc4ILL9It3YA5bligXHcdn4KR91xnPLAsLBf2UIVc7S5DbcFXbifn2KZuRTZi767OBL-PLwvknR97xUuEfBT2Dnddbx91apchDDqMxkEloJc0VbhNzmeXxITZV5zWYuVGpy8FFza9p_7iiAMTOWRyWryBoyFTT5--Ah7lnvOE35ZMVOfv2Bummx5beILVq3rIDcJdkTEcDOV_kSReHjh63qfyDn9yYjoFPoYQ88lgohjAnBSArOqlM",
    span: "row-span-1",
    size: "small",
    href: "/products?concern=digestion",
  },
  {
    title: "Lustrous Hair",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcdGupICZWwZJXWoeN-xVKdzSMnzUgPKDixLK40nykl5zKAp1v-L1aQ9cLrYaLN3CvyfiOOZmSLJsHbDt0EymtsKhyDtPflwtoEy5bDaGpnvE0dHzYGCfpBxazw6G8-cb6MuGIoen4X_JoYUNB29Ev9Xp2LwinFA6GLyJkYOCgFyCLYy750iMf3ZhI2-d27UfKaCNMX6x5EdgWLCY6bb881Z2morgUJkCeyRa34zJVDA6tTtevRJbqZL3HBNv3mzZxt7hXEzp2IZE",
    span: "col-span-2 row-span-1",
    size: "large",
    href: "/products?concern=hair",
  },
];

export const adminOrderStatuses = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export const homeFeaturePillars = [
  {
    title: "Ayurvedic Living",
    description: "Ingredient-first education, rituals, and wellness-led shopping journeys.",
  },
  {
    title: "Deeper Catalog",
    description: "Ayurvedic adaptogens, cognitive boosters, immunity rituals, and skin treatments surfaced cleanly on mobile.",
  },
  {
    title: "Trust and Transparency",
    description: "Batch-quality storytelling, sourcing notes, and certification-forward product pages.",
  },
];

// Keep old trustHighlights for backward compat
export const trustHighlights = [
  "Doctor verified Ayurvedic formulations",
  "Lab tested for purity — 100% natural",
  "Farm-to-home sourcing with transparent batches",
];
