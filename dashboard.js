// Register Chart.js specific defaults
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = "#64748b";
Chart.defaults.plugins.tooltip.backgroundColor = "#1e293b";
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.elements.line.tension = 0.4; // smooth curves

const primaryBlue = '#2563eb';
const primaryLight = '#dbeafe';
const dangerRed = '#ef4444';
const warningYellow = '#f59e0b';
const secondaryGreen = '#059669';

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DISEASE TRENDS OVER TIME (Line Chart) ---
    const trendCtx = document.getElementById('trendChart').getContext('2d');

    const gradientLine = trendCtx.createLinearGradient(0, 0, 0, 300);
    gradientLine.addColorStop(0, 'rgba(37, 99, 235, 0.4)'); // primary hue fade
    gradientLine.addColorStop(1, 'rgba(37, 99, 235, 0.0)');

    const trendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Respiratory Illness',
                    data: [120, 190, 150, 100, 80, 70, 90, 140, 210, 250, 310, 350],
                    borderColor: primaryBlue,
                    backgroundColor: gradientLine,
                    borderWidth: 2,
                    fill: true,
                    pointBackgroundColor: primaryBlue,
                    pointRadius: 3,
                    pointHoverRadius: 6
                },
                {
                    label: 'Vector-borne (Dengue/Malaria)',
                    data: [40, 50, 60, 80, 150, 250, 320, 290, 180, 100, 60, 40],
                    borderColor: warningYellow,
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    pointBackgroundColor: warningYellow,
                    pointRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { usePointStyle: true, boxWidth: 8 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { borderDash: [2, 4], color: '#e2e8f0' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });


    // --- 2. MONTH-TO-MONTH COMPARISON (Bar Chart) ---
    const comparisonCtx = document.getElementById('comparisonChart').getContext('2d');
    const comparisonChart = new Chart(comparisonCtx, {
        type: 'bar',
        data: {
            labels: ['North', 'South', 'East', 'West'],
            datasets: [
                {
                    label: 'Previous Month',
                    data: [320, 190, 450, 210],
                    backgroundColor: '#cbd5e1', // Light Gray
                    borderRadius: 4
                },
                {
                    label: 'Current Month',
                    data: [330, 150, 620, 180], // Higher in East (Warning)
                    backgroundColor: [
                        secondaryGreen, // North: Stable
                        secondaryGreen, // South: Down
                        dangerRed,      // East: High Spike
                        secondaryGreen  // West: Down
                    ],
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8 } }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { borderDash: [2, 4], color: '#e2e8f0' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });


    // --- 3. HOSPITAL LOAD ESTIMATION (Stacked Bar/Line) ---
    const loadCtx = document.getElementById('hospitalLoadChart').getContext('2d');
    const loadChart = new Chart(loadCtx, {
        type: 'bar',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4 (Est)', 'Week 5 (Est)'],
            datasets: [
                {
                    // Bar for actual bed utilization
                    type: 'bar',
                    label: 'Occupied Beds',
                    data: [450, 480, 560, 680, 750],
                    backgroundColor: primaryLight,
                    borderColor: primaryBlue,
                    borderWidth: 1,
                    borderRadius: 4
                },
                {
                    // Line for total capacity
                    type: 'line',
                    label: 'Total Bed Capacity',
                    data: [800, 800, 800, 800, 800],
                    borderColor: '#94a3b8',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8 } }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: 1000,
                    grid: { borderDash: [2, 4], color: '#e2e8f0' }
                },
                x: { grid: { display: false } }
            }
        }
    });

    // --- FILTER INTERACTIONS ---
    const filters = document.querySelectorAll('.dashboard-filters select');
    const loader = document.getElementById('dashboardLoader');

    filters.forEach(filter => {
        filter.addEventListener('change', () => {
            // Show fake loading overlay
            loader.classList.remove('hidden');

            // Simulate API fetch delay
            setTimeout(() => {
                // In a real app, you would fetch new data based on filters here
                // We're just randomly modifying the existing charts to simulate change

                updateChartWithRandomData(trendChart);
                updateChartWithRandomData(comparisonChart);
                updateChartWithRandomData(loadChart);

                loader.classList.add('hidden');
            }, 800);
        });
    });

    function updateChartWithRandomData(chart) {
        chart.data.datasets.forEach((dataset) => {
            // Apply slight random variance
            dataset.data = dataset.data.map(val => {
                const variance = val * 0.2; // +/- 20%
                let newVal = Math.floor(val + (Math.random() * variance * 2) - variance);
                return Math.max(0, newVal); // Ensure no negatives
            });
        });
        chart.update();
    }
});
