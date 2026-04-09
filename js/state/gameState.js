// /js/state/gameState.js

const state = {
    scene: 'menu', 
    ribbonView: 'raw', 
    marketTab: 'exchange', 
    estateName: 'Lockwood Keep',
    resources: { 
        wood: 50, stone: 20, iron: 0, gold: 100, food: 150, 
        planks: 0, polished_stone: 0, nails: 0, gems: 0, spices: 0, 
        furniture: 0, jewelry: 0, weaponry: 0 
    },
    population: { total: 3, max: 5, assigned: 3 },
    armyWorkers: 0, 
    buildings: {
        housing: { level: 1, built: true },
        farm: { level: 1, built: true },
        woodcutter: { level: 1, built: true },
        quarry: { level: 1, built: true },
        mine: { level: 0, built: false },
        market: { level: 0, built: false },
        sawmill: { level: 0, built: false },
        masonry: { level: 0, built: false },
        forge: { level: 0, built: false },
        goldsmith: { level: 0, built: false },
        apothecary: { level: 0, built: false },
        carpenter: { level: 0, built: false },
        jeweler: { level: 0, built: false },
        armory: { level: 0, built: false }
    },
    assignments: { 
        farming: 1, woodcutting: 1, mining_stone: 1, mining_iron: 0, taxing: 0,
        milling_planks: 0, polishing_stone: 0, forging_nails: 0, cutting_gems: 0, grinding_spices: 0,
        crafting_furniture: 0, crafting_jewelry: 0, crafting_weaponry: 0
    },
    garrison: {
        pikemen: 0, archers: 0, knights: 0, siege_towers: 0, cannons: 0
    },
    market: {
        wood: { buy: 4, sell: 2, trend: 0 },
        stone: { buy: 8, sell: 5, trend: 0 },
        iron: { buy: 22, sell: 15, trend: 0 },
        food: { buy: 2, sell: 1, trend: 0 },
        planks: { buy: 15, sell: 10, trend: 0 },
        polished_stone: { buy: 25, sell: 15, trend: 0 },
        nails: { buy: 50, sell: 35, trend: 0 },
        gems: { buy: 120, sell: 80, trend: 0 },
        spices: { buy: 20, sell: 15, trend: 0 },
        furniture: { buy: 150, sell: 100, trend: 0 },
        jewelry: { buy: 400, sell: 280, trend: 0 },
        weaponry: { buy: 350, sell: 250, trend: 0 }
    },
    territories: [
        { id: 't0', name: 'Starting Estate', owner: 'player', specialty: 'none', cost: 0 },
        { id: 't1', name: 'Stonehaven', owner: 'npc', specialty: 'stone', cost: 25000 },
        { id: 't2', name: 'Ironcrag', owner: 'npc', specialty: 'iron', cost: 50000 },
        { id: 't3', name: 'Greenfield', owner: 'npc', specialty: 'food', cost: 75000 },
        { id: 't4', name: 'Goldshire', owner: 'npc', specialty: 'gold', cost: 150000 }
    ],
    orders: [],
    tierIndex: 0,
    availableSpecs: 0,
    specs: { 
        wood: 0, stone: 0, iron: 0, gold: 0, food: 0, bldCost: 0, 
        planks: 0, polished_stone: 0, nails: 0, gems: 0, spices: 0, 
        furniture: 0, jewelry: 0, weaponry: 0 
    },
    rates: { 
        wood: 0, stone: 0, iron: 0, gold: 0, food: 0, 
        planks: 0, polished_stone: 0, nails: 0, gems: 0, spices: 0, 
        furniture: 0, jewelry: 0, weaponry: 0 
    },
    tick: 0
};