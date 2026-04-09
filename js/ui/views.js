// /js/ui/views.js

function renderGarrison() {
    const container = document.getElementById('garrison-grid');
    if (!container) return;
    container.innerHTML = '';
    
    let totalAtt = 0;
    let totalDef = 0;
    
    for (let [id, data] of Object.entries(UNIT_DATA)) {
        const count = state.garrison[id];
        totalAtt += data.att * count;
        totalDef += data.def * count;
        
        const idle = state.population.total - state.population.assigned;
        const affordable = state.resources.weaponry >= data.cost.weaponry && idle >= data.workers;

        const card = document.createElement('div');
        card.className = `parchment-card p-4 flex flex-col justify-between`;
        card.innerHTML = `
            <div class="mb-4">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-3xl">${data.icon}</span>
                    <span class="text-xs uppercase px-2 py-1 bg-black/30 rounded text-red-500 font-bold">Count: ${count}</span>
                </div>
                <h3 class="medieval-font text-lg text-white mb-1">${data.name}</h3>
                <p class="text-xs text-gray-400 mb-2">${data.desc}</p>
                <div class="flex gap-4 text-xs font-bold text-gray-300">
                    <span>⚔️ ATT: ${data.att}</span>
                    <span>🛡️ DEF: ${data.def}</span>
                </div>
            </div>
            <div>
                <div class="flex justify-between items-center text-xs mb-3 bg-black/50 p-2 rounded border border-yellow-900/30">
                    <span class="text-gray-400 font-bold mr-2">COST:</span>
                    <div class="flex gap-2 font-bold">
                        <span class="${state.resources.weaponry >= data.cost.weaponry ? 'text-gray-300' : 'text-red-400'}">${data.cost.weaponry} WEA</span>
                        <span class="${idle >= data.workers ? 'text-gray-300' : 'text-red-400'}">${data.workers} POP</span>
                    </div>
                </div>
                <button onclick="recruitUnit('${id}')" class="w-full py-2 rounded text-xs font-bold btn-medieval uppercase text-red-500 shadow-lg" ${!affordable ? 'disabled' : ''}>
                    Recruit Regiment
                </button>
            </div>
        `;
        container.appendChild(card);
    }

    document.getElementById('garrison-att').textContent = totalAtt;
    document.getElementById('garrison-def').textContent = totalDef;
    document.getElementById('garrison-upkeep').textContent = (state.armyWorkers * 1.875).toFixed(1);
}

function renderTerritories() {
    const grid = document.getElementById('territories-grid');
    grid.innerHTML = '';
    
    for (let t of state.territories) {
        const isOwned = t.owner === 'player';
        const card = document.createElement('div');
        card.className = `parchment-card p-6 flex flex-col justify-between ${isOwned ? 'border-green-600/50 bg-green-900/10' : ''}`;
        
        card.innerHTML = `
            <div>
                <div class="flex justify-between items-start mb-4">
                    <h3 class="medieval-font text-2xl ${isOwned ? 'text-green-500' : 'text-white'} drop-shadow-md">${t.name}</h3>
                    <span class="text-[10px] uppercase px-2 py-1 bg-black/60 shadow-md rounded ${isOwned ? 'text-green-400' : 'text-red-400'} font-bold">
                        ${isOwned ? 'Controlled' : 'Independent'}
                    </span>
                </div>
                ${t.specialty !== 'none' ? `<p class="text-sm text-gray-300 mb-2">Regional Specialty: <span class="font-bold text-yellow-500 uppercase">${t.specialty}</span></p>` : `<p class="text-sm text-gray-500 italic mb-2">Founding Estate</p>`}
                <p class="text-xs text-gray-400 mb-6">${isOwned && t.specialty !== 'none' ? '+25% ' + t.specialty + ' production is active globally.' : (!isOwned ? 'Unclaimed territory. Purchase to annex and unlock its regional bonus.' : 'Your seat of power.')}</p>
            </div>
            <div>
                ${!isOwned ? `
                <div class="flex justify-between items-center text-sm mb-3 bg-black/50 p-2 rounded border border-yellow-900/30">
                    <span class="text-gray-400 font-bold">COST:</span>
                    <span class="${state.resources.gold >= t.cost ? 'text-yellow-500' : 'text-red-500'} font-bold">${t.cost.toLocaleString()} Gold</span>
                </div>
                <button onclick="buyTerritory('${t.id}')" class="w-full py-3 rounded text-sm font-bold btn-medieval uppercase text-yellow-500 shadow-lg" ${state.resources.gold < t.cost ? 'disabled' : ''}>
                    Annex Territory
                </button>
                ` : `
                <div class="w-full py-3 rounded text-sm font-bold bg-green-900/20 border border-green-600/30 text-green-500 text-center uppercase tracking-widest">
                    Owned
                </div>
                `}
            </div>
        `;
        grid.appendChild(card);
    }
}

function renderSpecs() {
    document.getElementById('unspent-specs').textContent = state.availableSpecs;
    const container = document.getElementById('specs-grid');
    container.innerHTML = '';

    const { tier } = getSettlementLevel(state.population.total);

    const tierCard = document.createElement('div');
    tierCard.className = `parchment-card p-4 col-span-full border-yellow-600 mb-2 bg-yellow-900/20`;
    tierCard.innerHTML = `
        <h3 class="medieval-font text-lg text-yellow-500 mb-1">Active Settlement Bonus: ${tier.name}</h3>
        <p class="text-sm text-gray-300">${tier.desc}</p>
    `;
    container.appendChild(tierCard);

    for (let spec of SPEC_DATA) {
        const currentVal = state.specs[spec.id];
        const card = document.createElement('div');
        card.className = `parchment-card p-4 flex flex-col justify-between`;
        card.innerHTML = `
            <div class="mb-4">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center gap-2">
                        <img src="${spec.icon}" alt="${spec.name}" class="w-12 h-12 object-contain">
                        <h3 class="medieval-font text-lg text-white">${spec.name}</h3>
                    </div>
                    <span class="text-xs uppercase px-2 py-1 bg-black/30 rounded text-yellow-600 font-bold">Lvl ${currentVal}</span>
                </div>
                <p class="text-xs text-gray-400">${spec.desc}</p>
            </div>
            <button onclick="buySpec('${spec.id}')" class="w-full py-2 rounded text-xs font-bold btn-medieval uppercase text-yellow-600" ${state.availableSpecs <= 0 ? 'disabled' : ''}>
                Upgrade
            </button>
        `;
        container.appendChild(card);
    }
}

function renderEstate() {
    const tasksContainer = document.getElementById('worker-tasks');
    tasksContainer.innerHTML = '';
    const idle = state.population.total - state.population.assigned;
    
    for (let [key, task] of Object.entries(TASK_DATA)) {
        const count = state.assignments[key];
        const isLocked = !state.buildings[task.bld].built;
        
        let consumesHTML = '';
        let hasMaterials = true;
        if (task.consumes) {
            const reqStr = Object.entries(task.consumes).map(([cRes, cAmt]) => `${cAmt} ${cRes.replace('_',' ')}`).join(', ');
            consumesHTML = `<div class="text-[10px] text-red-300 font-bold mt-1 drop-shadow-md border border-red-900/50 bg-black/50 px-1 rounded inline-block">Cost: ${reqStr} / t</div>`;
            
            if (count > 0 && task._activeCyclesThisTick !== undefined && task._activeCyclesThisTick < count) {
                hasMaterials = false;
            }
        }

        const div = document.createElement('div');
        div.className = `parchment-card p-4 flex items-center justify-between relative overflow-hidden ${isLocked ? 'opacity-40 grayscale' : ''} ${!hasMaterials && !isLocked ? 'border-red-500' : ''}`;
        div.style.backgroundImage = `linear-gradient(to right, rgba(42,36,30,0.95) 30%, rgba(42,36,30,0.4) 100%), url('${task.icon}')`;
        div.style.backgroundSize = 'cover';
        div.style.backgroundPosition = 'center right';

        div.innerHTML = `
            <div class="flex items-center gap-3 relative z-10 w-full pr-16">
                <div class="w-full">
                    <div class="font-bold text-gray-100 drop-shadow-md text-sm md:text-base">${task.name} <span class="text-xs font-normal text-gray-400">(${count})</span></div>
                    <div class="text-xs ${hasMaterials ? 'text-gray-300' : 'text-red-400 font-bold'} drop-shadow-md">${isLocked ? 'Building Required' : (hasMaterials ? 'Active' : 'Missing Materials')}</div>
                    ${consumesHTML}
                </div>
            </div>
            <div class="flex gap-2 relative z-10">
                <button onclick="assignWorker('${key}', -1)" class="w-8 h-8 rounded btn-medieval shadow-lg font-bold" ${isLocked || count <= 0 ? 'disabled' : ''}>-</button>
                <button onclick="assignWorker('${key}', 1)" class="w-8 h-8 rounded btn-medieval shadow-lg font-bold" ${isLocked || idle <= 0 ? 'disabled' : ''}>+</button>
            </div>
        `;
        tasksContainer.appendChild(div);
    }

    const buildingsContainer = document.getElementById('buildings-grid');
    buildingsContainer.innerHTML = '';
    for (let [key, data] of Object.entries(BUILDING_DATA)) {
        const bld = state.buildings[key];
        const costs = calculateCost(key);
        const affordable = canAfford(costs);
        const costList = Object.entries(costs).map(([res, val]) => `<span class="${state.resources[res] >= val ? 'text-gray-300' : 'text-red-400'}">${val}${res.substring(0,3).toUpperCase()}</span>`).join(' ');

        const card = document.createElement('div');
        card.className = `parchment-card p-4 flex flex-col justify-between relative overflow-hidden min-h-[160px]`;
        card.style.backgroundImage = `linear-gradient(to bottom, rgba(42,36,30,0.95) 0%, rgba(42,36,30,0.3) 50%, rgba(42,36,30,0.95) 100%), url('${data.icon}')`;
        card.style.backgroundSize = 'cover';
        card.style.backgroundPosition = 'center';

        card.innerHTML = `
            <div class="mb-4 relative z-10">
                <div class="flex justify-between items-start mb-2">
                    <div class="w-16 h-4"></div>
                    <span class="text-xs uppercase px-2 py-1 bg-black/60 shadow-md rounded text-yellow-500 font-bold border border-yellow-900/50">Lvl ${bld.level}</span>
                </div>
                <h3 class="medieval-font text-lg text-white mb-1 drop-shadow-md">${data.name}</h3>
                <p class="text-xs text-gray-200 drop-shadow-md font-semibold">${data.desc}</p>
            </div>
            <div class="relative z-10">
                <div class="flex justify-between items-center text-xs mb-3 bg-black/50 p-2 rounded border border-yellow-900/30 overflow-x-auto">
                    <span class="text-gray-400 font-bold drop-shadow-md mr-2">COST:</span>
                    <div class="flex gap-2 drop-shadow-md font-bold">${costList}</div>
                </div>
                <button onclick="buildOrUpgrade('${key}')" class="w-full py-2 rounded text-xs font-bold btn-medieval uppercase text-yellow-500 shadow-lg" ${!affordable ? 'disabled' : ''}>
                    ${bld.level === 0 ? 'Construct' : 'Upgrade'}
                </button>
            </div>
        `;
        buildingsContainer.appendChild(card);
    }
}

function updateCustomTotal(resId) {
    const input = document.getElementById(`custom-amount-${resId}`);
    if (!input) return;
    const amount = parseInt(input.value, 10) || 0;
    const prices = state.market[resId];
    if (!prices) return;
    
    const buyCost = amount * prices.buy;
    const sellGain = amount * prices.sell;
    
    const totalEl = document.getElementById(`custom-total-${resId}`);
    if (totalEl) {
        totalEl.innerHTML = `Cost: <span class="text-yellow-600">${buyCost.toFixed(1)}</span> | Gain: <span class="text-green-500">${sellGain.toFixed(1)}</span>`;
    }
    
    const btnBuyX = document.getElementById(`btn-buyX-${resId}`);
    const btnSellX = document.getElementById(`btn-sellX-${resId}`);
    if (btnBuyX) btnBuyX.disabled = state.resources.gold < buyCost || amount < 1;
    if (btnSellX) btnSellX.disabled = state.resources[resId] < amount || amount < 1;
}

function renderMarket() {
    if (state.marketTab === 'exchange') {
        const container = document.getElementById('market-table-body');
        const resources = [
            { id: 'wood', name: 'Raw Timber', icon: 'https://i.imgur.com/Qh5Aevn.png' },
            { id: 'stone', name: 'Cut Stone', icon: 'https://i.imgur.com/52EtS1N.png' },
            { id: 'iron', name: 'Iron Ore', icon: 'https://i.imgur.com/HpxMHvI.png' },
            { id: 'food', name: 'Rations', icon: 'https://i.imgur.com/7yht9Bv.png' },
            { id: 'planks', name: 'Planks', icon: 'https://i.imgur.com/YOUR_PLANKS_ICON.png' },
            { id: 'polished_stone', name: 'Polished Stone', icon: 'https://i.imgur.com/YOUR_POLISHED_STONE_ICON.png' },
            { id: 'nails', name: 'Nails', icon: 'https://i.imgur.com/YOUR_NAILS_ICON.png' },
            { id: 'gems', name: 'Gems', icon: 'https://i.imgur.com/YOUR_GEMS_ICON.png' },
            { id: 'spices', name: 'Spices', icon: 'https://i.imgur.com/YOUR_SPICES_ICON.png' },
            { id: 'furniture', name: 'Furniture', icon: 'https://i.imgur.com/YOUR_FURNITURE_ICON.png' },
            { id: 'jewelry', name: 'Jewelry', icon: 'https://i.imgur.com/YOUR_JEWELRY_ICON.png' },
            { id: 'weaponry', name: 'Weaponry', icon: 'https://i.imgur.com/YOUR_WEAPONRY_ICON.png' }
        ];

        if (container.children.length === 0) {
            resources.forEach(res => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="py-4 px-4">
                        <div class="flex items-center gap-2">
                            <img src="${res.icon}" alt="${res.name}" class="w-10 h-10 object-contain">
                            <span class="font-bold">${res.name}</span>
                        </div>
                    </td>
                    <td id="market-trend-${res.id}" class="py-4 px-4 text-center text-lg"></td>
                    <td class="py-4 px-4 font-mono text-yellow-500"><span id="market-buy-${res.id}"></span> <span class="text-[10px]">GOLD</span></td>
                    <td class="py-4 px-4 font-mono text-yellow-700"><span id="market-sell-${res.id}"></span> <span class="text-[10px]">GOLD</span></td>
                    <td class="py-4 px-4 text-right">
                        <div class="flex gap-4 justify-end items-center">
                            <div class="flex flex-col items-center">
                                <input type="number" id="custom-amount-${res.id}" value="100" min="1" class="w-16 bg-black/40 border border-yellow-900/40 p-1 rounded text-white text-xs text-center focus:outline-none focus:border-yellow-600" oninput="updateCustomTotal('${res.id}')">
                            <div id="custom-total-${res.id}" class="text-[9px] text-gray-400 mt-1 whitespace-nowrap text-center"></div>
                            </div>
                            <div class="flex gap-1 border-r border-yellow-900/30 pr-4">
                                <button id="btn-sell1-${res.id}" onclick="sellResource('${res.id}', 1)" class="btn-medieval px-2 py-1 rounded text-xs font-bold">Sell 1</button>
                                <button id="btn-sell10-${res.id}" onclick="sellResource('${res.id}', 10)" class="btn-medieval px-2 py-1 rounded text-xs font-bold">10</button>
                                <button id="btn-sellX-${res.id}" onclick="sellCustomFromInput('${res.id}')" class="btn-medieval px-2 py-1 rounded text-xs font-bold">X</button>
                            </div>
                            <div class="flex gap-1">
                                <button id="btn-buy1-${res.id}" onclick="buyResource('${res.id}', 1)" class="btn-medieval px-2 py-1 rounded text-xs font-bold text-yellow-600">Buy 1</button>
                                <button id="btn-buy10-${res.id}" onclick="buyResource('${res.id}', 10)" class="btn-medieval px-2 py-1 rounded text-xs font-bold text-yellow-600">10</button>
                                <button id="btn-buyX-${res.id}" onclick="buyCustomFromInput('${res.id}')" class="btn-medieval px-2 py-1 rounded text-xs font-bold text-yellow-600">X</button>
                            </div>
                        </div>
                    </td>
                `;
                container.appendChild(tr);
            });
        }

        resources.forEach(res => {
            const prices = state.market[res.id];
            const trendIcon = prices.trend > 0 ? '📈' : '📉'; 
            const trendColor = prices.trend > 0 ? 'text-green-500' : 'text-red-500';

            const trendEl = document.getElementById(`market-trend-${res.id}`);
            trendEl.textContent = trendIcon;
            trendEl.className = `py-4 px-4 text-center ${trendColor} text-lg`;

            document.getElementById(`market-buy-${res.id}`).textContent = prices.buy.toFixed(1);
            document.getElementById(`market-sell-${res.id}`).textContent = prices.sell.toFixed(1);

            document.getElementById(`btn-sell1-${res.id}`).disabled = state.resources[res.id] < 1;
            document.getElementById(`btn-sell10-${res.id}`).disabled = state.resources[res.id] < 10;

            document.getElementById(`btn-buy1-${res.id}`).disabled = state.resources.gold < (prices.buy * 1);
            document.getElementById(`btn-buy10-${res.id}`).disabled = state.resources.gold < (prices.buy * 10);
            
            updateCustomTotal(res.id);
        });
    }

    if (state.marketTab === 'orders') {
        const tSelect = document.getElementById('order-territory');
        const independentTerritories = state.territories.filter(t => t.owner !== 'player');
        
        if(tSelect.children.length === 0 && independentTerritories.length > 0) {
            independentTerritories.forEach(t => {
                tSelect.innerHTML += `<option value="${t.id}">${t.name} (Specialty: ${t.specialty})</option>`;
            });
        } else if (independentTerritories.length === 0) {
            tSelect.innerHTML = `<option value="">No independent territories available.</option>`;
        }

        const rSelect = document.getElementById('order-resource');
        if(rSelect.children.length === 0) {
            ALL_RESOURCES.forEach(r => {
                if(r !== 'gold') rSelect.innerHTML += `<option value="${r}">${r.replace('_', ' ').toUpperCase()}</option>`;
            });
        }

        const list = document.getElementById('active-orders-list');
        list.innerHTML = '';
        if (state.orders.length === 0) {
            list.innerHTML = '<p class="text-sm text-gray-500 italic">No active trade agreements.</p>';
        } else {
            state.orders.forEach(o => {
                const div = document.createElement('div');
                const isImport = o.type === 'import';
                const hasError = o.status === 'insufficient_gold' || o.status === 'insufficient_resource';
                
                let statusBadge = '<span class="text-[10px] bg-green-900/80 text-white px-1 rounded uppercase tracking-wider font-bold">Active</span>';
                if (o.status === 'insufficient_gold') statusBadge = '<span class="text-[10px] bg-red-900/80 text-white px-1 rounded uppercase tracking-wider font-bold">Suspended: No Gold</span>';
                if (o.status === 'insufficient_resource') statusBadge = '<span class="text-[10px] bg-red-900/80 text-white px-1 rounded uppercase tracking-wider font-bold">Suspended: No Resources</span>';

                const actionText = isImport ? 'Importing' : 'Exporting';

                div.className = `flex justify-between items-center p-3 border rounded ${!hasError ? 'bg-black/40 border-yellow-900/30' : 'bg-red-900/10 border-red-900/50'}`;
                div.innerHTML = `
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-sm font-bold ${!hasError ? 'text-yellow-500' : 'text-red-400'}">${o.territoryName}</span>
                            ${statusBadge}
                        </div>
                        <span class="text-xs ${!hasError ? 'text-gray-400' : 'text-red-400/70'} block">${actionText} <span class="${!hasError ? 'text-white' : 'text-red-300'} font-bold">${o.amount} ${o.resource.replace('_', ' ').toUpperCase()}</span> at ${o.price.toFixed(1)} gold/tick</span>
                    </div>
                    <button onclick="cancelOrder(${o.id})" class="btn-medieval px-3 py-1 rounded text-xs font-bold text-red-400 border-red-900/50 hover:bg-red-900/30">Cancel</button>
                `;
                list.appendChild(div);
            });
        }
    }
}