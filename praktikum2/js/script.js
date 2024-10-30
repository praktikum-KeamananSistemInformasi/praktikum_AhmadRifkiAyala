function nextStep(stepId) {
    document.querySelectorAll('.step').forEach(step => step.style.display = 'none');
    document.getElementById(stepId).style.display = 'block';
}

function calculateDreadScore() {
    const damage = parseInt(document.getElementById('damage').value);
    const reproducibility = parseInt(document.getElementById('reproducibility').value);
    const exploitability = parseInt(document.getElementById('exploitability').value);
    const affectedUsers = parseInt(document.getElementById('affectedUsers').value);
    const discoverability = parseInt(document.getElementById('discoverability').value);

    const totalScore = damage + reproducibility + exploitability + affectedUsers + discoverability;
    document.getElementById('dreadScore').innerText = `Total DREAD Score: ${totalScore}`;

    nextStep('step4');
}

function completeAssessment() {
    const assetName = document.getElementById('assetName').value;
    const threatType = document.getElementById('threatType').value;
    const dreadScore = document.getElementById('dreadScore').innerText;
    const mitigation = document.getElementById('mitigation').value;

    const summaryContent = `Asset: ${assetName}<br>
                            Threat Type: ${threatType}<br>
                            ${dreadScore}<br>
                            Mitigation: ${mitigation}`;

    document.getElementById('summaryContent').innerHTML = summaryContent;
    document.getElementById('steps-container').style.display = 'none';
    document.getElementById('summary').style.display = 'block';

    // Generate DREAD Chart
    generateDreadChart();
}

function generateDreadChart() {
    const damage = parseInt(document.getElementById('damage').value);
    const reproducibility = parseInt(document.getElementById('reproducibility').value);
    const exploitability = parseInt(document.getElementById('exploitability').value);
    const affectedUsers = parseInt(document.getElementById('affectedUsers').value);
    const discoverability = parseInt(document.getElementById('discoverability').value);

    const ctx = document.getElementById('dreadChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Damage', 'Reproducibility', 'Exploitability', 'Affected Users', 'Discoverability'],
            datasets: [{
                label: 'DREAD Analysis Scores',
                data: [damage, reproducibility, exploitability, affectedUsers, discoverability],
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