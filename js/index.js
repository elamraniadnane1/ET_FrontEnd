/* index.js
 * This script powers interactive and dynamic features of the Energy Tracker dashboard.
 * It handles:
 * - Responsive navigation menu toggling
 * - Dark mode theme toggling
 * - Dynamic date/time display
 * - Chart.js initialization and dynamic data updates
 * - Recommendations fetching, filtering, and refreshing
 * - Modal interaction for detailed recommendations
 * - User menu interaction
 * - Print and back-to-top functionalities
 * - Language selection
 * - Search form handling
 * - Offline fallback and Service Worker registration for PWA
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Global state variables
    let currentTheme = localStorage.getItem('theme') || 'light';
    let recommendationsData = []; // Will store fetched recommendations
    let filteredRecommendations = []; // Store filtered set
    let currentFilter = 'all';

    // Element references
    const body = document.body;
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.getElementById('nav-menu');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const datetimeEl = document.getElementById('datetime');
    const timeRangeSelect = document.getElementById('timeRange');
    const energyChartEl = document.getElementById('energyChart');
    const recommendationList = document.getElementById('recommendations-list');
    const recommendationFilter = document.getElementById('recommendation-filter');
    const refreshRecommendationsBtn = document.getElementById('refresh-recommendations');
    const recommendationModal = document.getElementById('recommendation-modal');
    const recommendationModalContent = recommendationModal.querySelector('.modal-body');
    const closeModalBtn = recommendationModal.querySelector('.close-btn');
    const userMenuToggle = document.getElementById('user-menu-toggle');
    const userMenu = document.getElementById('user-menu');
    const languageSelect = document.getElementById('language-select');
    const printChartBtn = document.getElementById('print-chart');
    const backToTopBtn = document.querySelector('.back-to-top');
    const offlineFallback = document.querySelector('.offline-fallback');
    const siteSearchForm = document.querySelector('.nav__search');
    const siteSearchInput = siteSearchForm ? siteSearchForm.querySelector('input[type="search"]') : null;

    // --------------------------------------------
    // Responsive Navigation Menu
    // --------------------------------------------
    navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
        navToggle.setAttribute('aria-expanded', !expanded);
        navMenu.classList.toggle('is-open', !expanded);
    });

    // Close nav menu if clicking outside or after selection of link (for mobile)
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('is-open');
        }
    });

    // --------------------------------------------
    // Theme Toggle (Dark/Light Mode)
    // --------------------------------------------
    const applyTheme = (theme) => {
        body.dataset.theme = theme;
        localStorage.setItem('theme', theme);
        themeToggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    };

    applyTheme(currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(currentTheme);
    });

    // --------------------------------------------
    // Dynamic Date/Time Display
    // --------------------------------------------
    const updateDateTime = () => {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        const formatted = now.toLocaleDateString(languageSelect.value, options);
        datetimeEl.textContent = formatted;
    };

    // Update time initially and every minute
    updateDateTime();
    setInterval(updateDateTime, 60000);

    // --------------------------------------------
    // Chart.js Initialization
    // --------------------------------------------
    let energyChart;
    const initialChartData = {
        labels: [], // will be populated dynamically
        datasets: [{
            label: 'Energy Usage (kWh)',
            data: [],
            backgroundColor: 'rgba(52, 152, 219, 0.5)',
            borderColor: '#3498db',
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#3498db'
        }]
    };

    const initChart = () => {
        if (energyChart) {
            energyChart.destroy();
        }
        energyChart = new Chart(energyChartEl, {
            type: 'line',
            data: initialChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'kWh'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                }
            }
        });
    };

    const fetchChartData = (range) => {
        // Simulate fetching data based on time range
        // In a real app, you'd fetch from an API endpoint
        const randomData = () => Array.from({ length: 10 }, () => Math.floor(Math.random() * 1000));
        const randomLabels = () => {
            const now = new Date();
            const labels = [];
            for (let i = 0; i < 10; i++) {
                const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                labels.unshift(d.toLocaleDateString(languageSelect.value, { month: 'short', day: 'numeric' }));
            }
            return labels;
        };
        return { labels: randomLabels(), data: randomData() };
    };

    const updateChartData = (range) => {
        const { labels, data } = fetchChartData(range);
        energyChart.data.labels = labels;
        energyChart.data.datasets[0].data = data;
        energyChart.update();
    };

    initChart();
    updateChartData(timeRangeSelect.value);

    timeRangeSelect.addEventListener('change', (e) => {
        updateChartData(e.target.value);
    });

    // Print chart functionality
    printChartBtn.addEventListener('click', () => {
        window.print();
    });

    // --------------------------------------------
    // Recommendations Handling
    // --------------------------------------------
    const fetchRecommendations = () => {
        // Simulate fetching recommendations from an API
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockData = [
                    { id: 1, title: 'Install LED bulbs', category: 'low-cost', details: 'Replace incandescent bulbs with LEDs to save energy.', impact: 'Medium' },
                    { id: 2, title: 'Adjust thermostat', category: 'quick-win', details: 'Set your thermostat a few degrees lower in winter and higher in summer.', impact: 'High' },
                    { id: 3, title: 'Insulate your home', category: 'high-impact', details: 'Proper insulation reduces heat loss, saving on heating and cooling.', impact: 'High' },
                    { id: 4, title: 'Use power strips', category: 'low-cost', details: 'Easily switch off multiple devices to reduce standby power.', impact: 'Low' },
                    { id: 5, title: 'Upgrade appliances', category: 'high-impact', details: 'Energy Star appliances are more efficient, reducing energy consumption.', impact: 'High' }
                ];
                resolve(mockData);
            }, 1500);
        });
    };

    const renderRecommendations = (data) => {
        recommendationList.innerHTML = '';
        if (data.length === 0) {
            const li = document.createElement('li');
            li.classList.add('recommendations-list__item');
            li.textContent = 'No recommendations found for the selected filter.';
            recommendationList.appendChild(li);
            return;
        }

        data.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('recommendations-list__item');
            li.setAttribute('tabindex', '0');
            li.setAttribute('role', 'button');
            li.setAttribute('aria-label', `View details for ${item.title}`);

            const titleEl = document.createElement('h3');
            titleEl.textContent = item.title;

            const categoryEl = document.createElement('p');
            categoryEl.textContent = `Category: ${item.category}`;

            const impactEl = document.createElement('p');
            impactEl.textContent = `Impact: ${item.impact}`;

            li.appendChild(titleEl);
            li.appendChild(categoryEl);
            li.appendChild(impactEl);

            // On click, open modal with details
            li.addEventListener('click', () => openRecommendationModal(item));

            recommendationList.appendChild(li);
        });
    };

    const loadRecommendations = async () => {
        recommendationList.innerHTML = `
            <li class="recommendations-list__item loading" aria-live="polite">
                <div class="loading-indicator" aria-hidden="true"></div>
                <span class="loading__text">Loading recommendations...</span>
            </li>
        `;
        recommendationsData = await fetchRecommendations();
        applyRecommendationFilter();
    };

    const applyRecommendationFilter = () => {
        if (currentFilter === 'all') {
            filteredRecommendations = recommendationsData;
        } else {
            filteredRecommendations = recommendationsData.filter(r => r.category === currentFilter);
        }
        renderRecommendations(filteredRecommendations);
    };

    recommendationFilter.addEventListener('change', (e) => {
        currentFilter = e.target.value;
        applyRecommendationFilter();
    });

    refreshRecommendationsBtn.addEventListener('click', loadRecommendations);

    // --------------------------------------------
    // Modal Handling for Recommendations
    // --------------------------------------------
    const openRecommendationModal = (item) => {
        recommendationModalContent.innerHTML = `
            <h3 id="modal-heading">${item.title}</h3>
            <p>${item.details}</p>
            <p><strong>Category:</strong> ${item.category}</p>
            <p><strong>Impact:</strong> ${item.impact}</p>
        `;
        recommendationModal.style.display = 'block';
        recommendationModal.setAttribute('aria-hidden', 'false');
        closeModalBtn.focus();
    };

    const closeRecommendationModal = () => {
        recommendationModal.style.display = 'none';
        recommendationModal.setAttribute('aria-hidden', 'true');
    };

    closeModalBtn.addEventListener('click', closeRecommendationModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && recommendationModal.getAttribute('aria-hidden') === 'false') {
            closeRecommendationModal();
        }
    });

    // Close modal if user clicks outside content
    recommendationModal.addEventListener('click', (e) => {
        if (e.target === recommendationModal) {
            closeRecommendationModal();
        }
    });

    // --------------------------------------------
    // User Menu Toggle
    // --------------------------------------------
    userMenuToggle.addEventListener('click', () => {
        const expanded = userMenuToggle.getAttribute('aria-expanded') === 'true' || false;
        userMenuToggle.setAttribute('aria-expanded', !expanded);
        userMenu.setAttribute('aria-hidden', expanded);
        userMenu.classList.toggle('open', !expanded);
    });

    document.addEventListener('click', (e) => {
        if (!userMenu.contains(e.target) && !userMenuToggle.contains(e.target)) {
            userMenuToggle.setAttribute('aria-expanded', 'false');
            userMenu.setAttribute('aria-hidden', 'true');
            userMenu.classList.remove('open');
        }
    });

    // --------------------------------------------
    // Language Selection
    // --------------------------------------------
    languageSelect.addEventListener('change', () => {
        // For demonstration, just update date/time format and chart labels
        updateDateTime();
        updateChartData(timeRangeSelect.value);
        // In a real application, you might reload the page or dynamically change UI text
    });

    // --------------------------------------------
    // Back to Top Button
    // --------------------------------------------
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --------------------------------------------
    // Search Form Handling
    // --------------------------------------------
    if (siteSearchForm && siteSearchInput) {
        siteSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = siteSearchInput.value.trim();
            if (query) {
                // In a real application, you'd perform a search action here
                alert(`Searching for: ${query}`);
            }
        });
    }

    // --------------------------------------------
    // Offline Fallback & PWA Service Worker
    // --------------------------------------------
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(() => console.log('Service Worker Registered'))
            .catch((err) => console.warn('SW registration failed', err));
    }

    window.addEventListener('online', () => {
        offlineFallback.style.display = 'none';
    });

    window.addEventListener('offline', () => {
        offlineFallback.style.display = 'block';
    });

    // Initial load of recommendations
    loadRecommendations();
});
