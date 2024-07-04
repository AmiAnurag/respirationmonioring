document.addEventListener('DOMContentLoaded', (event) => {
    const apiUrl = 'https://api.thingspeak.com/channels/2591485/feeds.json?api_key=F0AJSL4BLCH1759E&results=10';
    let chart;

    const fetchData = () => {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const feeds = data.feeds;
                const labels = feeds.map(feed => new Date(feed.created_at).toLocaleTimeString());
                const respirationRates = feeds.map(feed => parseFloat(feed.field1));

                if (chart) {
                    // Update existing chart
                    chart.data.labels = labels;
                    chart.data.datasets[0].data = respirationRates;
                    chart.update();
                } else {
                    // Create a new chart
                    const ctx = document.getElementById('respirationRateChart').getContext('2d');
                    chart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'Respiration Rate',
                                data: respirationRates,
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                                fill: false,
                            }]
                        },
                        options: {
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Time'
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Respiration Rate'
                                    }
                                }
                            },
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'top',
                                },
                            },
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    // Fetch data initially
    fetchData();

    // Fetch data every minute
    setInterval(fetchData, 60000);
});
