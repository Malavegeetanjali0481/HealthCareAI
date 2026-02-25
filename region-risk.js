document.addEventListener('DOMContentLoaded', () => {

    const ctx = document.getElementById('seasonalChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Sum (M)', 'Sum (J)', 'Mon (J)', 'Mon (A)', 'Win (N)', 'Win (D)', 'Win (J)', 'Win (F)'],
                datasets: [
                    {
                        label: 'Respiratory Cases',
                        data: [120, 110, 180, 210, 310, 420, 450, 390],
                        borderColor: '#0ea5e9', // Blue
                        backgroundColor: 'rgba(14, 165, 233, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Viral Fever',
                        data: [200, 250, 450, 520, 300, 280, 220, 190],
                        borderColor: '#f59e0b', // Yellow/Warning
                        backgroundColor: 'rgba(245, 158, 11, 0.05)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        borderDash: [5, 5]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: { filter: 'Inter', size: 12 }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: '#e2e8f0', drawBorder: false }
                    },
                    x: {
                        grid: { display: false, drawBorder: false }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

});
