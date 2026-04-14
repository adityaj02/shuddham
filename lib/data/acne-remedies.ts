export type SkinType = "Oily" | "Dry" | "Normal";
export type AcneSeverity = "Low" | "Moderate" | "Severe";

export interface AcneRemedy {
  id: string;
  skinTypes: SkinType[];
  severities: AcneSeverity[];
  ingredients: string;
  preparationMethod: string;
  benefits: string;
}

export const acneRemedies: AcneRemedy[] = [
  {
    id: "R1",
    skinTypes: ["Oily", "Dry", "Normal"],
    severities: ["Moderate", "Severe"],
    ingredients: "Nicker Nut (Caesalpinia bonducella)",
    preparationMethod: "Grind the nuts with fresh milk",
    benefits: "Provides cooling and soothing effects with astringent properties; hydrates the skin while reducing inflammation. Research suggests its seeds have antimicrobial properties, aiding in skin infections."
  },
  {
    id: "R2",
    skinTypes: ["Dry"],
    severities: ["Moderate", "Severe"],
    ingredients: "Fresh Turmeric with Honey",
    preparationMethod: "Grind fresh turmeric and mix with honey and water.",
    benefits: "Offers anti-inflammatory and antiseptic benefits, helping to calm irritated skin and fight bacteria"
  },
  {
    id: "R3",
    skinTypes: ["Oily"],
    severities: ["Moderate", "Severe"],
    ingredients: "Lodhra Tree Bark Blend - Lodhra Bark, Sweet Flag (Acorus calamus), Coriander (Coriandrum sativum )",
    preparationMethod: "Grind the ingredients together with water.",
    benefits: "An antibacterial herbal blend that promotes skin health by reducing bacterial growth and soothing irritation."
  },
  {
    id: "R4",
    skinTypes: ["Oily", "Dry", "Normal"],
    severities: ["Moderate"],
    ingredients: "Cow Bezoar Blend - Cow Bezoar, Black Pepper Seeds, Indian Madder Stem (Rubia cordifolia)",
    preparationMethod: "Grind the ingredients with water.",
    benefits: "Delivers deep detoxification and inflammation relief; suitable for both dry and oily skin types, helping to cleanse and balance the complexion."
  },
  {
    id: "R5",
    skinTypes: ["Oily", "Dry"],
    severities: ["Moderate"],
    ingredients: "Sweet Flag Rhizome (Acorus calamus)",
    preparationMethod: "Grind the rhizome with lime juice.",
    benefits: "Suitable for both dry and oily skin types, offering versatility in addressing various skin concerns without causing imbalance."
  },
  {
    id: "R6",
    skinTypes: ["Dry"],
    severities: ["Moderate"],
    ingredients: "Sandalwood Spice Blend - Cardamom, Black Pepper, Indian Sandalwood",
    preparationMethod: "Grind with water and apply as a paste.",
    benefits: "Provides anti-inflammatory and skin-calming effects, helping to reduce redness and promote a more balanced, serene complexion."
  },
  {
    id: "R7",
    skinTypes: ["Oily", "Dry", "Normal"],
    severities: ["Severe", "Moderate"],
    ingredients: "Lodhra Mustard Blend - Lodhra, Field Mustard (Brassica rapa), Sweet flag (Acorus calamus), Rock salt",
    preparationMethod: "Grind all ingredients together with water.",
    benefits: "Detoxifies and exfoliates the skin, removing impurities and dead cells for a refreshed and clearer appearance."
  },
  {
    id: "R8",
    skinTypes: ["Oily"],
    severities: ["Moderate", "Low"],
    ingredients: "Tamarind Seed Shell (Tamarindus indica)",
    preparationMethod: "Grind with vinegar to form a paste.",
    benefits: "Effectively removes excess oil with a mild exfoliating action, ideal for controlling shine without over-drying."
  },
  {
    id: "R9",
    skinTypes: ["Dry"],
    severities: ["Moderate", "Severe"],
    ingredients: "Silk Cotton Tree Thorns (Salmalia malabarica)",
    preparationMethod: "Grind fresh thorns with fresh milk.",
    benefits: "Provides gentle nourishment, making it particularly suitable for dry skin by restoring moisture and softness."
  },
  {
    id: "R10",
    skinTypes: ["Dry"],
    severities: ["Moderate", "Severe", "Low"],
    ingredients: "Indian Madder Stem (Rubia cordifolia)",
    preparationMethod: "Grind with water and mix with honey.",
    benefits: "Supports scar healing with anti-inflammatory effects, helping to fade marks and promote even skin tone"
  },
  {
    id: "R11",
    skinTypes: ["Dry"],
    severities: ["Moderate", "Severe"],
    ingredients: "Arjun Tree Bark (Terminalia arjuna)",
    preparationMethod: "Grind with water and mix with honey.",
    benefits: "Aids in skin regeneration and prevents discoloration, fostering healthier, more uniform skin over time."
  },
  {
    id: "R12",
    skinTypes: ["Oily"],
    severities: ["Moderate", "Severe", "Low"],
    ingredients: "White Turmeric (Curcuma zedoaria)",
    preparationMethod: "Take the rhizome and grind with water to form a paste.",
    benefits: "Effective for scars, as it supports tissue repair and reduces the appearance of blemishes through its natural compounds. Research suggests curcuminoids in turmeric varieties like this can aid wound healing by modulating inflammation."
  },
  {
    id: "R13",
    skinTypes: ["Oily", "Dry", "Normal"],
    severities: ["Low"],
    ingredients: "Dried Indian Gooseberry (Phyllanthus emblica)",
    preparationMethod: "Fry with ghee and grind into a paste.",
    benefits: "Beneficial for scars, helping to minimize their visibility and improve skin texture with consistent use."
  },
  {
    id: "R14",
    skinTypes: ["Oily", "Dry", "Normal"],
    severities: ["Moderate", "Severe"],
    ingredients: "Turmeric (Curcuma longa)",
    preparationMethod: "Mix powder with water, curd, or honey to make a paste.",
    benefits: "Anti-inflammatory properties that reduce redness, calming reactive skin and restoring balance effectively."
  },
  {
    id: "R15",
    skinTypes: ["Oily", "Dry", "Normal"],
    severities: ["Moderate"],
    ingredients: "Sandalwood (Santalum album)",
    preparationMethod: "Make a paste with water or rosewater.",
    benefits: "Soothes and treats skin issues, providing relief from irritation and promoting overall skin comfort."
  },
  {
    id: "R16",
    skinTypes: ["Oily", "Dry", "Normal"],
    severities: ["Low", "Moderate", "Severe"],
    ingredients: "Aloe Vera",
    preparationMethod: "Apply the fresh gel directly from the leaf.",
    benefits: "Moisturizing, cooling, and anti-inflammatory effects that hydrate and calm the skin naturally."
  },
  {
    id: "R17",
    skinTypes: ["Oily", "Dry", "Normal"],
    severities: ["Low"],
    ingredients: "Resveratrol from Red Grapes",
    preparationMethod: "Crush red grapes and apply the juice.",
    benefits: "Acts as an antioxidant that reduces inflammation, protecting the skin from oxidative stress and damage. Studies indicate resveratrol can support skin health by enhancing collagen production."
  },
  {
    id: "R18",
    skinTypes: ["Dry"],
    severities: ["Low"],
    ingredients: "Bees Honey",
    preparationMethod: "Apply raw honey directly.",
    benefits: "Offers healing and antibacterial benefits while reducing scars, ideal for soothing and repairing minor wounds."
  },
  {
    id: "R19",
    skinTypes: ["Oily", "Dry", "Normal"],
    severities: ["Moderate"],
    ingredients: "Natural Vitamin C & E Extracts",
    preparationMethod: "Apply in serum form or as a natural extract.",
    benefits: "Brightens the skin, aids in healing, and reduces inflammation for a more vibrant and even complexion."
  },
  {
    id: "R20",
    skinTypes: ["Oily", "Dry", "Normal"],
    severities: ["Moderate"],
    ingredients: "Indian Gooseberry (Phyllanthus emblica)",
    preparationMethod: "Make a juice or powder paste.",
    benefits: "Antioxidant-rich with purifying effects that help reduce pigmentation and promote clearer skin."
  },
  {
    id: "R21",
    skinTypes: ["Dry"],
    severities: ["Low"],
    ingredients: "Fenugreek Seeds (Trigonella foenum-graecum)",
    preparationMethod: "Soak seeds and grind to a paste.",
    benefits: "Provides anti-inflammatory benefits and sebum control, making it great for balancing oily skin without stripping moisture."
  },
  {
    id: "R22",
    skinTypes: ["Oily", "Dry", "Normal"],
    severities: ["Moderate", "Severe"],
    ingredients: "Neem (Azadirachta indica)",
    preparationMethod: "Make a paste from fresh leaves or extract juice.",
    benefits: "Strong antibacterial and antifungal properties that help combat acne and other skin infections effectively."
  },
  {
    id: "R23",
    skinTypes: ["Oily", "Dry", "Normal"],
    severities: ["Moderate", "Severe"],
    ingredients: "Licorice Root (Glycyrrhiza glabra)",
    preparationMethod: "Mix powder with water to form a paste.",
    benefits: "Anti-pigmentation benefits with calming, cooling, and anti-inflammatory actions to soothe and even out skin tone."
  },
  {
    id: "R24",
    skinTypes: ["Oily", "Normal"],
    severities: ["Severe", "Moderate"],
    ingredients: "Lemongrass Root (Cymbopogon citratus)",
    preparationMethod: "Create infused oil or grind with water for a paste.",
    benefits: "Antibacterial properties that tighten pores, reducing the appearance of enlarged pores for smoother skin."
  },
  {
    id: "R25",
    skinTypes: ["Oily"],
    severities: ["Low"],
    ingredients: "Coffee",
    preparationMethod: "Make a scrub or paste with water",
    benefits: "Acts as an exfoliant that reduces puffiness, refreshing the skin and minimizing swelling around the eyes or face."
  },
  {
    id: "R26",
    skinTypes: ["Oily", "Dry", "Normal"],
    severities: ["Low"],
    ingredients: "Elderberry (Sambucus nigra)",
    preparationMethod: "Use juice or extract.",
    benefits: "Rich in antioxidants that promote healing, energizing the skin for a revitalized look and feel."
  },
  {
    id: "R27",
    skinTypes: ["Oily"],
    severities: ["Moderate"],
    ingredients: "Scarlet Jungle Flame (Ixora coccinea)",
    preparationMethod: "Make a paste from flowers with water; alternatively, consume a decoction from stem bark for internal support.",
    benefits: "Anti-acne with astringent effects that help tighten skin and reduce breakouts naturally."
  },
  {
    id: "R28",
    skinTypes: ["Oily", "Normal"],
    severities: ["Moderate"],
    ingredients: "Lemon",
    preparationMethod: "Dilute juice in water or honey.",
    benefits: "Exfoliates, brightens, and provides antibacterial benefits to enhance skin clarity and glow."
  },
  {
    id: "R29",
    skinTypes: ["Dry", "Normal"],
    severities: ["Low"],
    ingredients: "Lavender (Lavandula)",
    preparationMethod: "Use diluted essential oil or an infusion.",
    benefits: "Calming and anti-inflammatory, helping to reduce redness and soothe sensitive areas gently."
  },
  {
    id: "R30",
    skinTypes: ["Oily"],
    severities: ["Moderate"],
    ingredients: "Papaya (Carica papaya)",
    preparationMethod: "Mash the fruit and apply directly.",
    benefits: "Exfoliates dead skin cells and brightens the complexion with natural enzymes like papain, which research indicates can gently dissolve keratin for smoother texture."
  }
];
