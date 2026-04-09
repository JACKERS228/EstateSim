// /js/core/actions.js

function buySpec(specId) {
    if (state.availableSpecs > 0) {
        state.specs[specId]++;
        state.availableSpecs--;
        notify("Specialization acquired.", "#4ade80");
        render();
    }
}

function buyTerritory(id) {
    const t = state.territories.find(x => x.id === id);
    if (t && t.owner !== 'player' && state.resources.gold >= t.cost) {
        state.resources.gold -= t.cost;
        t.owner = 'player';
        notify(`You have annexed ${t.name}! Its specialty bonus is now active.`, "#fbbf24");
        
        const priorOrders = state.orders.length;
        state.orders = state.orders.filter(o => o.territoryId !== id);
        if (state.orders.length < priorOrders) {
            notify("Prior trade orders with this region have been dissolved.", "#a3a3a3");
        }
        
        render();
    } else {
        notify("Insufficient gold.", "#ef4444");
    }
}

function submitOrder() {
    const tId = document.getElementById('order-territory').value;
    const type = document.getElementById('order-type').value;
    const res = document.getElementById('order-resource').value;
    const amount = parseInt(document.getElementById('order-amount').value, 10);
    const price = parseFloat(document.getElementById('order-price').value);

    if(!tId || !type || !res || isNaN(amount) || amount <= 0 || isNaN(price) || price <= 0) {
        return notify("Invalid order terms.", "#ef4444");
    }

    const territory = state.territories.find(t => t.id === tId);
    if(!territory || territory.owner === 'player') return notify("Invalid territory.", "#ef4444");

    let priceRatio;
    if (type === 'import') {
        const marketBuy = state.market[res].buy;
        priceRatio = price / marketBuy;
    } else {
        const marketSell = state.market[res].sell;
        priceRatio = marketSell / price;
    }

    const ownedCount = state.territories.filter(t => t.owner === 'player').length;
    const wealthFactor = Math.min(1.0, state.resources.gold / 100000); 
    
    const finalChance = priceRatio + (ownedCount * 0.05) + (wealthFactor * 0.1);

    if (finalChance < 0.8 || Math.random() > finalChance) {
        notify(`${territory.name} rejected your offer. They demand a fairer price.`, "#ef4444");
    } else {
        state.orders.push({
            id: Date.now(),
            territoryId: tId,
            territoryName: territory.name,
            type: type,
            resource: res,
            amount: amount,
            price: price,
            status: 'active'
        });
        notify(`${territory.name} accepted the trade agreement!`, "#4ade80");
        renderMarket(); 
    }
}

function cancelOrder(id) {
    state.orders = state.orders.filter(o => o.id !== id);
    renderMarket();
}

function calculateCost(bldKey) {
    const bld = state.buildings[bldKey];
    const data = BUILDING_DATA[bldKey];
    const costs = {};
    
    let bldCostMult = 1;
    const { tier } = getSettlementLevel(state.population.total);
    if (tier.bonus.bldCost) bldCostMult *= tier.bonus.bldCost;
    if (state.specs.bldCost) bldCostMult *= (1 - (state.specs.bldCost * 0.05));

    for (let [res, val] of Object.entries(data.baseCost)) {
        costs[res] = Math.floor(val * Math.pow(data.costMult, bld.level) * bldCostMult);
    }
    return costs;
}

function canAfford(costs) {
    for (let [res, val] of Object.entries(costs)) {
        if (state.resources[res] < val) return false;
    }
    return true;
}

function assignWorker(taskKey, delta) {
    const idle = state.population.total - state.population.assigned;
    if (delta > 0 && idle <= 0) return;
    if (delta < 0 && state.assignments[taskKey] <= 0) return;

    const bldKey = TASK_DATA[taskKey].bld;
    if (!state.buildings[bldKey].built) {
        notify("Building required.", "#ef4444");
        return;
    }

    state.assignments[taskKey] += delta;
    state.population.assigned += delta;
    render();
}

function buildOrUpgrade(bldKey) {
    const costs = calculateCost(bldKey);
    if (!canAfford(costs)) {
        notify("Insufficient resources.", "#ef4444");
        return;
    }

    for (let [res, val] of Object.entries(costs)) {
        state.resources[res] -= val;
    }

    state.buildings[bldKey].level++;
    state.buildings[bldKey].built = true;
    
    if (bldKey === 'housing') {
        state.population.max = 5 + BUILDING_DATA.housing.benefit(state.buildings.housing.level - 1);
    }

    notify(`${BUILDING_DATA[bldKey].name} Upgrade Complete.`, "#fbbf24");
    render();
}

function recruitUnit(unitId) {
    const unit = UNIT_DATA[unitId];
    const idle = state.population.total - state.population.assigned;

    if (idle < unit.workers) {
        return notify(`Need ${unit.workers} idle workers to recruit ${unit.name}.`, "#ef4444");
    }
    if (state.resources.weaponry < unit.cost.weaponry) {
        return notify(`Insufficient Weaponry. Need ${unit.cost.weaponry}.`, "#ef4444");
    }

    state.resources.weaponry -= unit.cost.weaponry;
    state.population.assigned += unit.workers;
    state.armyWorkers += unit.workers;
    state.garrison[unitId]++;
    
    notify(`Recruited a regiment of ${unit.name}!`, "#fbbf24");
    render();
}