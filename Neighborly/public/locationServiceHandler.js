document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('searchForm');
    const locationSelect = document.getElementById('locationSelect');
    const resultsContainer = document.getElementById('results');
    const serviceForm = document.getElementById('serviceForm');
    const commentForm = document.getElementById('commentForm');
    const commentList = document.getElementById('commentList');

    // Handle search form submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const selectedCategory = document.getElementById('category').value.trim();
        const searchTerm = document.getElementById('searchTerm').value.trim().toLowerCase();
        const selectedLocation = locationSelect.value.trim();

        const data = await fetchServices();

        const filtered = data.filter(service => {
            const category = service.category ? service.category.toLowerCase().trim() : '';
            const matchCategory = !selectedCategory || category === selectedCategory.toLowerCase().trim();
        
            const matchLocation = !selectedLocation || 
                service.city === selectedLocation || 
                service.region === selectedLocation;
        
            const matchKeyword = !searchTerm || (
                service.name?.toLowerCase().includes(searchTerm) ||
                service.description?.toLowerCase().includes(searchTerm) ||
                service.address?.toLowerCase().includes(searchTerm)
            );
        
            return matchCategory && matchLocation && matchKeyword;
        });

        displayResults(filtered);
    });

    // Handle dropdown location change
    locationSelect.addEventListener('change', async function () {
        const selectedLocation = this.value;
        const data = await fetchServices();

        const filtered = data.filter(service =>
            service.city === selectedLocation || service.region === selectedLocation
        );

        displayResults(filtered);
    });

    // Handle Suggest Service form
    if (serviceForm) {
        serviceForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const name = document.getElementById('serviceName').value.trim();
            const location = document.getElementById('serviceLocation').value.trim();
            const category = document.getElementById('serviceCategory').value.trim();
            const details = document.getElementById('serviceDetails').value.trim();

            const newService = {
                name,
                address: location,
                category,
                description: details || 'User-submitted service',
                city: location,  // Simplified assumption
                region: '',
                contact: 'N/A',
                url: ''
            };

            try {
                const response = await fetch('/api/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newService)
                });

                if (response.ok) {
                    alert('Service suggestion submitted successfully!');
                    this.reset();
                } else {
                    alert('Failed to submit the service. Try again later.');
                }
            } catch (error) {
                console.error('Error submitting service:', error);
                alert('An error occurred while submitting the service.');
            }
        });
    }

    // Handle Comment form
    if (commentForm) {
        commentForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const comment = document.getElementById('userComment').value.trim();

            if (comment) {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'user-comment';
                commentDiv.textContent = comment;
                commentList.prepend(commentDiv);
                document.getElementById('userComment').value = '';
            }
        });
    }

    async function fetchServices() {
        try {
            const response = await fetch('/api/services');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching services:', error);
            return [];
        }
    }

    function displayResults(services) {
        resultsContainer.innerHTML = '';

        if (services.length === 0) {
            resultsContainer.innerHTML = '<p>No services found. Try a different search or suggest one!</p>';
            return;
        }

        services.forEach(service => {
            const entry = document.createElement('div');
            entry.className = 'service-card';

            entry.innerHTML = `
                <h3>${service.name}</h3>
                <p><strong>Category:</strong> ${service.category}</p>
                <p>${service.description}</p>
                <p><strong>Address:</strong> ${service.address}</p>
                <p><strong>Contact:</strong> ${service.contact}</p>
                ${service.url ? `<p><a href="${service.url}" target="_blank">Visit Website</a></p>` : ''}
                <p><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(service.address)}" target="_blank">View on Map</a></p>
                <hr/>
            `;
            resultsContainer.appendChild(entry);
        });
    }
});