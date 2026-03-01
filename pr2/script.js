const monitoringParams = [
    { id: "param0", name: "Вироблення біогазу", min: 20, max: 80, normMin: 40, normMax: 70, unit: "м³/год" },
    { id: "param1", name: "Вміст метану", min: 55, max: 70, normMin: 60, normMax: 68, unit: "%" },
    { id: "param2", name: "Температура реактора", min: 35, max: 55, normMin: 38, normMax: 45, unit: "°C" },
    { id: "param3", name: "Потужність", min: 0, max: 300, normMin: 100, normMax: 250, unit: "кВт" },
    { id: "extra0", name: "Рівень субстрату", min: 0, max: 100, normMin: 20, normMax: 90, unit: "%" },
    { id: "extra1", name: "pH середовища", min: 6.0, max: 9.0, normMin: 6.8, normMax: 7.5, unit: "pH" }
];

let autoInterval = null;
let isAutoEnabled = false;

function getRandom(min, max, decimals = 1) {
    return (Math.random() * (max - min) + min).toFixed(decimals);
}

function getStatus(value, param) {
    const val = parseFloat(value);
    if (val >= param.normMin && val <= param.normMax) return 'normal';
    if (val >= param.min && val <= param.max) return 'warning';
    return 'danger';
}

function updateAllData() {
    monitoringParams.forEach((param) => {
        const element = document.getElementById(param.id);
        if (element) {
            const isFloat = param.id === 'param1' || param.id === 'extra1';
            const value = getRandom(param.min, param.max, isFloat ? 1 : 0);
            const status = getStatus(value, param);
            
            element.textContent = value;
            
            const statusId = param.id.replace('param', 'status').replace('extra', 'statusExtra');
            const indicator = document.getElementById(statusId);
            if (indicator) {
                indicator.className = `status-indicator status-${status}`;
            }
        }
    });

    const workTimeElem = document.getElementById('workTime');
    if (workTimeElem) {
        workTimeElem.textContent = (parseInt(workTimeElem.textContent || 0) + 1);
    }

    const lastUpdateElem = document.getElementById('lastUpdate');
    if (lastUpdateElem) {
        lastUpdateElem.textContent = new Date().toLocaleTimeString('uk-UA');
    }
}

function toggleAutoUpdate() {
    const btn = document.getElementById('autoUpdateBtn');
    const statusText = document.getElementById('autoStatus');

    if (!isAutoEnabled) {
        autoInterval = setInterval(updateAllData, 3000);
        isAutoEnabled = true;
        btn.textContent = "Зупинити";
        btn.className = "btn btn-danger";
        statusText.textContent = "Увімкнено (3с)";
    } else {
        clearInterval(autoInterval);
        isAutoEnabled = false;
        btn.textContent = "Автооновлення";
        btn.className = "btn btn-success";
        statusText.textContent = "Вимкнено";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateAllData();
    const updateBtn = document.getElementById('updateBtn');
    const autoBtn = document.getElementById('autoUpdateBtn');
    
    if (updateBtn) updateBtn.addEventListener('click', updateAllData);
    if (autoBtn) autoBtn.addEventListener('click', toggleAutoUpdate);
});