// /js/data/constants.js

const ALL_RESOURCES = [
    'wood', 'stone', 'iron', 'gold', 'food', 
    'planks', 'polished_stone', 'nails', 'gems', 'spices', 
    'furniture', 'jewelry', 'weaponry'
];

const SETTLEMENT_TIERS = [
    { name: "Homestead", req: 1, bonus: { res: "food", mult: 1.1 }, desc: "+10% Food Production" },
    { name: "Hamlet", req: 50, bonus: { res: "wood", mult: 1.15 }, desc: "+15% Wood Production" },
    { name: "Village", req: 250, bonus: { res: "stone", mult: 1.2 }, desc: "+20% Stone Production" },
    { name: "Thorpe", req: 600, bonus: { res: "iron", mult: 1.25 }, desc: "+25% Iron Production" },
    { name: "Town", req: 1500, bonus: { res: "gold", mult: 1.3 }, desc: "+30% Gold Revenue" },
    { name: "Market Town", req: 3000, bonus: { bldCost: 0.9 }, desc: "-10% Building Costs" },
    { name: "Large Town", req: 6000, bonus: { res: "food", mult: 1.5 }, desc: "+50% Food Production" },
    { name: "City", req: 12000, bonus: { res: "gold", mult: 1.5 }, desc: "+50% Gold Revenue" },
    { name: "Regional Center", req: 25000, bonus: { bldCost: 0.75 }, desc: "-25% Building Costs" },
    { name: "Capital", req: 50000, bonus: { res: "all", mult: 2.0 }, desc: "+100% All Production" }
];

const SPEC_DATA = [
    { id: "wood", name: "Forestry", icon: "https://i.imgur.com/YOUR_SPEC_FORESTRY_ICON.png", desc: "+10% Wood Production per point" },
    { id: "stone", name: "Masonry", icon: "https://i.imgur.com/YOUR_SPEC_MASONRY_ICON.png", desc: "+10% Stone Production per point" },
    { id: "iron", name: "Metallurgy", icon: "https://i.imgur.com/YOUR_SPEC_METALLURGY_ICON.png", desc: "+10% Iron Production per point" },
    { id: "gold", name: "Commerce", icon: "https://i.imgur.com/YOUR_SPEC_COMMERCE_ICON.png", desc: "+10% Gold Revenue per point" },
    { id: "food", name: "Agriculture", icon: "https://i.imgur.com/YOUR_SPEC_AGRICULTURE_ICON.png", desc: "+10% Food Production per point" },
    { id: "bldCost", name: "Architecture", icon: "https://i.imgur.com/YOUR_SPEC_ARCHITECTURE_ICON.png", desc: "-5% Building Costs per point" }
];

const BUILDING_DATA = {
    housing: { name: "Peasant Cottages", icon: "https://i.imgur.com/YOUR_HOUSING_ICON.png", desc: "Increases max population exponentially.", baseCost: { wood: 30, stone: 10 }, costMult: 1.6, benefit: (lvl) => Math.floor(10 * Math.pow(1.8, lvl) - 10) },
    farm: { name: "Village Farm", icon: "https://i.imgur.com/YOUR_FARM_ICON.png", desc: "Improves food yield.", baseCost: { wood: 20, stone: 5 }, costMult: 1.4, benefit: (lvl) => 1 + (lvl * 0.5) },
    woodcutter: { name: "Woodcutter's Hut", icon: "https://i.imgur.com/YOUR_WOODCUTTER_ICON.png", desc: "Enables timber harvesting.", baseCost: { wood: 10, stone: 5 }, costMult: 1.5, benefit: (lvl) => 1 + (lvl * 0.4) },
    quarry: { name: "Stone Quarry", icon: "https://i.imgur.com/YOUR_QUARRY_ICON.png", desc: "Extracts construction stone.", baseCost: { wood: 40, stone: 20 }, costMult: 1.7, benefit: (lvl) => 0.8 + (lvl * 0.3) },
    mine: { name: "Iron Mine", icon: "https://i.imgur.com/YOUR_MINE_ICON.png", desc: "Deep iron ore excavation.", baseCost: { wood: 60, stone: 60, gold: 20 }, costMult: 1.8, benefit: (lvl) => 0.5 + (lvl * 0.2) },
    market: { name: "Market Square", icon: "https://i.imgur.com/YOUR_MARKET_BLD_ICON.png", desc: "Unlocks trade and tax revenue.", baseCost: { wood: 50, stone: 30, iron: 10 }, costMult: 2.0, benefit: (lvl) => 0.5 + (lvl * 0.5) },
    
    sawmill: { name: "Lumber Mill", icon: "https://i.imgur.com/YOUR_SAWMILL_ICON.png", desc: "Refines Wood into Planks.", baseCost: { wood: 100, stone: 50 }, costMult: 1.6, benefit: (lvl) => lvl },
    masonry: { name: "Stonemason", icon: "https://i.imgur.com/YOUR_STONEMASON_ICON.png", desc: "Polishes rough stone.", baseCost: { wood: 50, stone: 100 }, costMult: 1.6, benefit: (lvl) => lvl },
    forge: { name: "Blacksmith Forge", icon: "https://i.imgur.com/YOUR_FORGE_ICON.png", desc: "Smiths iron into nails.", baseCost: { stone: 150, iron: 50 }, costMult: 1.6, benefit: (lvl) => lvl },
    goldsmith: { name: "Goldsmith", icon: "https://i.imgur.com/YOUR_GOLDSMITH_ICON.png", desc: "Cuts gold into gems.", baseCost: { stone: 100, gold: 100 }, costMult: 1.8, benefit: (lvl) => lvl },
    apothecary: { name: "Spice Mill", icon: "https://i.imgur.com/YOUR_SPICEMILL_ICON.png", desc: "Grinds food into spices.", baseCost: { wood: 100, stone: 100 }, costMult: 1.6, benefit: (lvl) => lvl },
    carpenter: { name: "Carpenter's Guild", icon: "https://i.imgur.com/YOUR_CARPENTER_ICON.png", desc: "Crafts elegant furniture.", baseCost: { wood: 200, planks: 50, nails: 50 }, costMult: 1.8, benefit: (lvl) => lvl },
    jeweler: { name: "Jeweler's Shop", icon: "https://i.imgur.com/YOUR_JEWELER_ICON.png", desc: "Crafts valuable jewelry.", baseCost: { stone: 200, polished_stone: 50, gems: 50 }, costMult: 2.0, benefit: (lvl) => lvl },
    armory: { name: "Armory", icon: "https://i.imgur.com/YOUR_ARMORY_ICON.png", desc: "Forges heavy weaponry.", baseCost: { wood: 150, iron: 150, nails: 50, polished_stone: 50 }, costMult: 2.0, benefit: (lvl) => lvl }
};

const TASK_DATA = {
    farming: { name: "Farming", res: "food", bld: "farm", icon: "https://i.imgur.com/YOUR_TASK_FARM_ICON.png" },
    woodcutting: { name: "Woodcutting", res: "wood", bld: "woodcutter", icon: "https://i.imgur.com/YOUR_TASK_WOOD_ICON.png" },
    mining_stone: { name: "Stone Mining", res: "stone", bld: "quarry", icon: "https://i.imgur.com/YOUR_TASK_STONE_ICON.png" },
    mining_iron: { name: "Iron Mining", res: "iron", bld: "mine", icon: "https://i.imgur.com/YOUR_TASK_IRON_ICON.png" },
    taxing: { name: "Tax Collection", res: "gold", bld: "market", icon: "https://i.imgur.com/YOUR_TASK_TAX_ICON.png" },
    
    milling_planks: { name: "Plank Milling", res: "planks", bld: "sawmill", icon: "https://i.imgur.com/YOUR_TASK_MILLING_ICON.png", consumes: { wood: 3, gold: 1 } },
    polishing_stone: { name: "Stone Polishing", res: "polished_stone", bld: "masonry", icon: "https://i.imgur.com/YOUR_TASK_POLISHING_ICON.png", consumes: { stone: 3, gold: 1 } },
    forging_nails: { name: "Nail Forging", res: "nails", bld: "forge", icon: "https://i.imgur.com/YOUR_TASK_FORGING_ICON.png", consumes: { iron: 2, gold: 1 } },
    cutting_gems: { name: "Gem Cutting", res: "gems", bld: "goldsmith", icon: "https://i.imgur.com/YOUR_TASK_GEMCUTTING_ICON.png", consumes: { gold: 5 } },
    grinding_spices: { name: "Spice Grinding", res: "spices", bld: "apothecary", icon: "https://i.imgur.com/YOUR_TASK_SPICEGRINDING_ICON.png", consumes: { food: 10, gold: 1 } },
    crafting_furniture: { name: "Furniture Craft", res: "furniture", bld: "carpenter", icon: "https://i.imgur.com/YOUR_TASK_FURNITURE_ICON.png", consumes: { planks: 2, nails: 2, gold: 5 } },
    crafting_jewelry: { name: "Jewelry Craft", res: "jewelry", bld: "jeweler", icon: "https://i.imgur.com/YOUR_TASK_JEWELRYCRAFT_ICON.png", consumes: { gems: 1, polished_stone: 1, gold: 10 } },
    crafting_weaponry: { name: "Weapon Forging", res: "weaponry", bld: "armory", icon: "https://i.imgur.com/YOUR_TASK_WEAPONCRAFT_ICON.png", consumes: { nails: 2, polished_stone: 2, gold: 5 } }
};

const UNIT_DATA = {
    pikemen: { name: "Pikemen", att: 2, def: 4, workers: 3, cost: { weaponry: 500 }, icon: "🛡️", desc: "Disciplined infantry holding the line." },
    archers: { name: "Archers", att: 3, def: 1, workers: 2, cost: { weaponry: 500 }, icon: "🏹", desc: "Long-range volley specialists." },
    knights: { name: "Knights", att: 5, def: 5, workers: 5, cost: { weaponry: 500 }, icon: "⚔️", desc: "Elite armored shock cavalry." },
    siege_towers: { name: "Siege Towers", att: 2, def: 6, workers: 4, cost: { weaponry: 500 }, icon: "🗼", desc: "Mobile fortresses and scaling platforms." },
    cannons: { name: "Cannons", att: 5, def: 1, workers: 3, cost: { weaponry: 500 }, icon: "💣", desc: "Devastating but vulnerable artillery." }
};

const MARKET_BASES = {
    wood: { min: 2, max: 6 },
    stone: { min: 4, max: 12 },
    iron: { min: 12, max: 35 },
    food: { min: 1, max: 4 },
    planks: { min: 10, max: 25 },
    polished_stone: { min: 15, max: 35 },
    nails: { min: 30, max: 70 },
    gems: { min: 80, max: 200 },
    spices: { min: 15, max: 30 },
    furniture: { min: 120, max: 350 },
    jewelry: { min: 350, max: 900 },
    weaponry: { min: 250, max: 600 }
};