// /js/main.js

// --- UI Navigation & State Toggles ---

function toggleRibbon() {
    state.ribbonView = state.ribbonView === 'raw' ? 'goods' : 'raw';
    document.getElementById('ribbon-raw').classList.toggle('hidden', state.ribbonView !== 'raw');
    document.getElementById('ribbon-goods').classList.toggle('hidden', state.ribbonView !== 'goods');
    document.getElementById('ribbon-toggle-text').textContent = state.ribbonView === 'raw' ? 'View Crafted Goods' : 'View Raw Resources';
}

function toggleMarketTab(tab) {
    state.marketTab = tab;
    document.getElementById('market-exchange-view').classList.toggle('hidden', tab !== 'exchange');
    document.getElementById('market-orders-view').classList.toggle('hidden', tab !== 'orders');
    
    document.getElementById('tab-exchange').className = `btn-medieval px-4 py-2 rounded text-sm font-bold market-tab-btn ${tab === 'exchange' ? 'text-yellow-500 border-yellow-600' : 'text-gray-400 border-transparent'}`;
    document.getElementById('tab-orders').className = `btn-medieval px-4 py-2 rounded text-sm font-bold market-tab-btn ${tab === 'orders' ? 'text-yellow-500 border-yellow-600' : 'text-gray-400 border-transparent'}`;
    
    renderMarket();
}

function startGame() {
    const input = document.getElementById('estate-name-input').value;
    state.estateName = input || "Lockwood Keep";
    state.territories[0].name = state.estateName;
    document.getElementById('display-estate-name').textContent = state.estateName;
    
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');
    state.scene = 'estate';
    render();
}

function switchScene(scene) {
    if (scene === 'market' && !state.buildings.market.built) {
        notify("You must build a Market Square first.", "#ef4444");
        return;
    }
    state.scene = scene;
    document.getElementById('view-estate').classList.toggle('hidden', scene !== 'estate');
    document.getElementById('view-market').classList.toggle('hidden', scene !== 'market');
    document.getElementById('view-specs').classList.toggle('hidden', scene !== 'specs');
    document.getElementById('view-territories').classList.toggle('hidden', scene !== 'territories');
    document.getElementById('view-garrison').classList.toggle('hidden', scene !== 'garrison');
    render();
}

// --- Game Engine Logic ---

function fluctuatePrices() {
    for (let [res, prices] of Object.entries(state.market)) {
        const base = MARKET_BASES[res];
        const change = (Math.random() * 2 - 1); 
        
        prices.buy = Math.max(base.min, Math.min(base.max, prices.buy + change));
        prices.sell = Math.max(base.min * 0.5, prices.buy * 0.6); 
        prices.trend = change;
    }
}

function gameTick() {
    if (state.scene === 'menu') return;
    state.tick++;

    const { tier, index, prestige } = getSettlementLevel(state.population.total);
    
    // Check Tier Up
    if (index > state.tierIndex) {
        const gained = index - state.tierIndex;
        state.availableSpecs += gained;
        state.tierIndex = index;
        notify(`Settlement reached Tier: ${tier.name}!`, "#fbbf24");
    }

    // Reset Rates
    for (let res of ALL_RESOURCES) {
        state.rates[res] = 0;
    }

    // Execute Trade Orders
    for (let order of state.orders) {
        let costOrGain = order.amount * order.price;
        
        if (order.type === 'import') {
            if (state.resources.gold >= costOrGain) {
                state.resources.gold -= costOrGain;
                state.resources[order.resource] += order.amount;
                state.rates.gold -= costOrGain;
                state.rates[order.resource] += order.amount;
                order.status = 'active';
            } else {
                order.status = 'insufficient_gold';
            }
        } else if (order.type === 'export') {
            if (state.resources[order.resource] >= order.amount) {
                state.resources[order.resource] -= order.amount;
                state.resources.gold += costOrGain;
                state.rates[order.resource] -= order.amount;
                state.rates.gold += costOrGain;
                order.status = 'active';
            } else {
                order.status = 'insufficient_resource';
            }
        }
    }

    // Pass 1: Deduct Consumptions to calculate actual valid production cycles
    for (let [taskKey, count] of Object.entries(state.assignments)) {
        if (count <= 0) continue;
        const task = TASK_DATA[taskKey];
        
        let possibleCycles = count;
        if (task.consumes) {
            let maxCycles = count;
            for (let [cRes, cAmt] of Object.entries(task.consumes)) {
                const affordable = Math.floor(state.resources[cRes] / cAmt);
                if (affordable < maxCycles) maxCycles = affordable;
            }
            possibleCycles = maxCycles;

            // Deduct
            if (possibleCycles > 0) {
                for (let [cRes, cAmt] of Object.entries(task.consumes)) {
                    const consumed = cAmt * possibleCycles;
                    state.resources[cRes] -= consumed;
                    state.rates[cRes] -= consumed;
                }
            }
        }
        task._activeCyclesThisTick = possibleCycles;
    }

    // Gather Territory Bonuses
    let territoryBonuses = {};
    for (let t of state.territories) {
        if (t.owner === 'player' && t.specialty !== 'none') {
            territoryBonuses[t.specialty] = (territoryBonuses[t.specialty] || 0) + 0.25; 
        }
    }

    // Pass 2: Calculate Production
    for (let [taskKey, count] of Object.entries(state.assignments)) {
        if (count <= 0) continue;
        const task = TASK_DATA[taskKey];
        const cycles = task._activeCyclesThisTick;

        if (cycles > 0) {
            const bldLevel = state.buildings[task.bld].level;
            const baseRate = BUILDING_DATA[task.bld].benefit(bldLevel);
            
            let resProduced = cycles * baseRate;
            
            if (tier.bonus.res === task.res || tier.bonus.res === 'all') {
                resProduced *= tier.bonus.mult;
            }
            resProduced *= (1 + (prestige * 0.05));
            
            if (state.specs[task.res]) {
                resProduced *= (1 + (state.specs[task.res] * 0.1));
            }
            
            if (territoryBonuses[task.res]) {
                resProduced *= (1 + territoryBonuses[task.res]);
            }

            state.rates[task.res] += resProduced;
            state.resources[task.res] += resProduced;
        }
    }

    // Consumption & Starvation
    const normalPop = state.population.total - state.armyWorkers;
    const armyPop = state.armyWorkers;
    const consumption = (normalPop * 1.5) + (armyPop * 1.875);
    
    state.rates.food -= consumption;
    state.resources.food -= consumption;

    if (state.resources.food < 0) {
        state.resources.food = 0;
        if (Math.random() < 0.5 && state.population.total > 0) {
            state.population.total--;
            
            // Determine if civilian or soldier perishes
            const isSoldier = state.armyWorkers > 0 && Math.random() < (state.armyWorkers / (state.population.total + 1));

            if (isSoldier) {
                const activeUnits = Object.keys(state.garrison).filter(k => state.garrison[k] > 0);
                const randomUnit = activeUnits[Math.floor(Math.random() * activeUnits.length)];
                const unitWorkers = UNIT_DATA[randomUnit].workers;
                
                state.garrison[randomUnit]--;
                state.population.assigned -= unitWorkers;
                state.armyWorkers -= unitWorkers;
                
                // Remaining workers in the disbanded unit survive as idle
                if (unitWorkers > 1) {
                    state.population.total += (unitWorkers - 1);
                }
                
                notify(`Starvation! A regiment of ${UNIT_DATA[randomUnit].name} has disbanded due to casualties.`, "#ef4444");
            } else {
                const activeTasks = Object.keys(state.assignments).filter(k => state.assignments[k] > 0);
                if (activeTasks.length > 0) {
                    const randomTask = activeTasks[Math.floor(Math.random() * activeTasks.length)];
                    state.assignments[randomTask]--;
                    state.population.assigned--;
                    notify(`Starvation! A ${TASK_DATA[randomTask].name} worker has perished.`, "#ef4444");
                } else {
                    notify("Starvation! An idle citizen has perished.", "#ef4444");
                }
            }
        }
    }

    // Market Logic
    if (state.tick % 15 === 0) { 
        fluctuatePrices();
        if (state.scene === 'market') notify("Market prices have updated.");
    }

    // Population Attraction
    if (state.tick % 10 === 0) {
        const hasFood = state.resources.food > 20;
        const hasSpace = state.population.total < state.population.max;
        if (Math.random() < 0.3 && hasSpace && hasFood) {
            state.population.total++;
            notify("A new worker has settled in.", "#4ade80");

            if (state.population.total >= 50000 && (state.population.total - 50000) % 5000 === 0) {
                state.availableSpecs++;
                notify("Prestige Level Increased! +1 Specialization", "#fbbf24");
            }
        }
    }

    render();
}

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    // Bind static UI interactions
    document.getElementById('btn-start-game').addEventListener('click', startGame);
    document.getElementById('btn-toggle-ribbon').addEventListener('click', toggleRibbon);
    document.getElementById('btn-submit-order').addEventListener('click', submitOrder);

    // Bind dynamic Navigation Buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchScene(e.currentTarget.dataset.target);
        });
    });

    // Bind Market Tab Buttons
    document.querySelectorAll('.market-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            toggleMarketTab(e.currentTarget.dataset.tab);
        });
    });

    // Initiate Game Engine Loop
    setInterval(gameTick, 1000);
});