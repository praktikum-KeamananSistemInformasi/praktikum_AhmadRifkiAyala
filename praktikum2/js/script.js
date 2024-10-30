let assets = [];

function nextStep(stepId) {
    document.querySelectorAll('.step').forEach(step => step.style.display = 'none');
    document.getElementById(stepId).style.display = 'block';
    if (stepId === 'step2') {
        generateThreatForms();
    } else if (stepId === 'step3') {
        generateDreadForms();
    } else if (stepId === 'step4') {
        generateMitigationForms();
    }
}

function addAssetInput() {
    const assetInputs = document.getElementById('assetInputs');
    const newAssetInput = document.createElement('div');
    newAssetInput.classList.add('asset-input');
    newAssetInput.innerHTML = `
        <label for="assetName">Asset Name:</label>
        <input type="text" class="assetName" name="assetName" required>
        <br>
        <label for="description">Description:</label>
        <input type="text" class="description" name="description" required>
        <br>
    `;
    assetInputs.appendChild(newAssetInput);
}

function generateThreatForms() {
    const threatFormsContainer = document.getElementById('threatFormsContainer');
    threatFormsContainer.innerHTML = '';
    const assetElements = document.querySelectorAll('.asset-input');
    assets = [];

    assetElements.forEach((element, index) => {
        const assetName = element.querySelector('.assetName').value;
        const description = element.querySelector('.description').value;
        assets.push({ assetName, description, threats: [], dreads: [], mitigations: [] });

        const threatForm = document.createElement('div');
        threatForm.classList.add('threat-form');
        threatForm.innerHTML = `
            <h3>Threat Identification for Asset: ${assetName}</h3>
            <label for="threatType_${index}">Threat Type:</label>
            <select id="threatType_${index}" name="threatType">
                <option value="Spoofing">Spoofing</option>
                <option value="Tampering">Tampering</option>
                <option value="Repudiation">Repudiation</option>
                <option value="Information Disclosure">Information Disclosure</option>
                <option value="Denial of Service">Denial of Service</option>
                <option value="Elevation of Privilege">Elevation of Privilege</option>
            </select>
            <br>
            <label for="threatDescription_${index}">Description:</label>
            <input type="text" id="threatDescription_${index}" name="threatDescription" required>
            <br>
        `;
        threatFormsContainer.appendChild(threatForm);
    });
}

function generateDreadForms() {
    const dreadFormsContainer = document.getElementById('dreadFormsContainer');
    dreadFormsContainer.innerHTML = '';

    assets.forEach((asset, index) => {
        const dreadForm = document.createElement('div');
        dreadForm.classList.add('dread-form');
        dreadForm.innerHTML = `
            <h3>DREAD Assessment for Asset: ${asset.assetName}</h3>
            <label for="damage_${index}">Damage Potential (1-10):</label>
            <input type="number" id="damage_${index}" name="damage" min="1" max="10" required>
            <br>
            <label for="reproducibility_${index}">Reproducibility (1-10):</label>
            <input type="number" id="reproducibility_${index}" name="reproducibility" min="1" max="10" required>
            <br>
            <label for="exploitability_${index}">Exploitability (1-10):</label>
            <input type="number" id="exploitability_${index}" name="exploitability" min="1" max="10" required>
            <br>
            <label for="affectedUsers_${index}">Affected Users (1-10):</label>
            <input type="number" id="affectedUsers_${index}" name="affectedUsers" min="1" max="10" required>
            <br>
            <label for="discoverability_${index}">Discoverability (1-10):</label>
            <input type="number" id="discoverability_${index}" name="discoverability" min="1" max="10" required>
            <br>
        `;
        dreadFormsContainer.appendChild(dreadForm);
    });
}

function generateMitigationForms() {
    const mitigationFormsContainer = document.getElementById('mitigationFormsContainer');
    mitigationFormsContainer.innerHTML = '';

    assets.forEach((asset, index) => {
        const mitigationForm = document.createElement('div');
        mitigationForm.classList.add('mitigation-form');
        mitigationForm.innerHTML = `
            <h3>Risk Mitigation for Asset: ${asset.assetName}</h3>
            <label for="mitigation_${index}">Mitigation Action:</label>
            <input type="text" id="mitigation_${index}" name="mitigation" required>
            <br>
            <label for="documentation_${index}">Documentation:</label>
            <input type="text" id="documentation_${index}" name="documentation" required>
            <br>
        `;
        mitigationFormsContainer.appendChild(mitigationForm);
    });
}

function completeAssessment() {
    let summaryContent = '';
    const tableBody = document.getElementById('threatTableBody');
    tableBody.innerHTML = '';

    assets.forEach((asset, index) => {
        const reproducibility = parseInt(document.getElementById(`reproducibility_${index}`).value);
        const exploitability = parseInt(document.getElementById(`exploitability_${index}`).value);
        const affectedUsers = parseInt(document.getElementById(`affectedUsers_${index}`).value);
        const discoverability = parseInt(document.getElementById(`discoverability_${index}`).value);
        const damage = parseInt(document.getElementById(`damage_${index}`).value);
        const mitigation = document.getElementById(`mitigation_${index}`).value;
        const documentation = document.getElementById(`documentation_${index}`).value;

        const totalScore = reproducibility + exploitability + affectedUsers + discoverability + damage;
        let priority = '';
        let priorityClass = '';

        if (totalScore >= 30) {
            priority = 'Tinggi';
            priorityClass = 'priority-high';
        } else if (totalScore >= 20) {
            priority = 'Sedang';
            priorityClass = 'priority-medium';
        } else {
            priority = 'Rendah';
            priorityClass = 'priority-low';
        }

        asset.dreads.push({ reproducibility, exploitability, affectedUsers, discoverability, damage, totalScore, priority });
        asset.mitigations.push({ mitigation, documentation });

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${asset.assetName}</td>
            <td>${reproducibility}</td>
            <td>${exploitability}</td>
            <td>${affectedUsers}</td>
            <td>${discoverability}</td>
            <td>${totalScore}</td>
            <td class="${priorityClass}">${priority}</td>
            <td>${mitigation}</td>
        `;
        tableBody.appendChild(newRow);
    });

    // Show the Threats List Table
    document.getElementById('threats-list').style.display = 'block';

    generateDreadChart();
}

function generateDreadChart() {
    const ctx = document.getElementById('dreadChart').getContext('2d');
    const labels = assets.map(asset => asset.assetName);
    const data = assets.map(asset => asset.dreads.reduce((acc, dread) => acc + dread.totalScore, 0));

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'DREAD Analysis Scores',
                data: data,
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}