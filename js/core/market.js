// /js/core/market.js



function buyResource(res, amount) {
    const cost = state.market[res].buy * amount;
    if (state.resources.gold >= cost) {
        state.resources.gold -= cost;
        state.resources[res] += amount;
        notify(`Purchased ${amount} ${res} for ${Math.floor(cost)} Gold`, "#fbbf24");
        render();
    } else {
        notify("Insufficient gold.", "#ef4444");
    }
}

function sellResource(res, amount) {
    if (state.resources[res] >= amount) {
        const gain = state.market[res].sell * amount;
        state.resources[res] -= amount;
        state.resources.gold += gain;
        notify(`Sold ${amount} ${res} for ${Math.floor(gain)} Gold`, "#4ade80");
        render();
    } else {
        notify(`Not enough ${res} to sell.`, "#ef4444");
    }
}

function buyCustomFromInput(res) {
    const input = document.getElementById(`custom-amount-${res}`);
    const amount = parseInt(input.value, 10);
    if (!isNaN(amount) && amount > 0) buyResource(res, amount);
}

function sellCustomFromInput(res) {
    const input = document.getElementById(`custom-amount-${res}`);
    const amount = parseInt(input.value, 10);
    if (!isNaN(amount) && amount > 0) sellResource(res, amount);
}