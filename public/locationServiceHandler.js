console.log("locationServiceHandler.js loaded");

// === Constants
const overlay = document.getElementById('walkthrough-overlay');
const steps = document.querySelectorAll('.walkthrough-step');
const params = new URLSearchParams(window.location.search);

const form = document.getElementById('searchForm');
const locationSelect = document.getElementById('locationSelect');
const categorySelect = document.getElementById('category');
const searchInput = document.getElementById('searchTerm');
const serviceForm = document.getElementById('serviceForm');
const commentForm = document.getElementById('commentForm');
const commentList = document.getElementById('commentList');
const resultsContainer = document.getElementById('results');

// === Handle Search Form Submission
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedLocation = locationSelect.value.trim().toLowerCase();
    const selectedCategory = categorySelect.value.trim().toLowerCase();
    const searchTerm = searchInput.value.trim().toLowerCase();

    console.log("Form submitted:", selectedLocation, selectedCategory, searchTerm);

    try {
      const services = await fetchServices(selectedLocation, selectedCategory, searchTerm);
      displayResults(services);
    } catch (error) {
      console.error('Error fetching services:', error);
      alert('Could not fetch services. Please check your connection.');
    }
  });
}

// === Handle Location Change
if (locationSelect) {
  locationSelect.addEventListener('change', () => {
    const value = locationSelect.value.trim();
    console.log("User selected location:", value);
  });
}

// === Handle Service Suggestion Submission
if (serviceForm) {
  serviceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('serviceName').value.trim();
    const location = document.getElementById('serviceLocation').value.trim();
    const category = document.getElementById('serviceCategory').value.trim();
    const details = document.getElementById('serviceDetails').value.trim();

    const newService = {
      city: location,
      region: '',                          // Placeholder or input
      name: name,
      category: category,
      description: details || 'User-submitted service',
      address: location,                   // Use real address field if separate
      contact: 'N/A',                      // Placeholder or input
      url: '',                             // Optional user field
      website: '',                         // Optional user field
      hours: '',                           // Optional user field
      latitude: 0,                         // Placeholder, or parseFloat if geocoded
      longitude: 0                         // Placeholder, or parseFloat if geocoded
    };

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService)
      });

      if (response.ok) {
        alert('Service suggestion submitted successfully!');
        serviceForm.reset();
      } else {
        alert('Failed to submit the service.');
      }
    } catch (error) {
      console.error('Error submitting service:', error);
      alert('An error occurred while submitting the service.');
    }
  });
}

// === Handle Comments
if (commentForm) {
  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const comment = document.getElementById('userComment').value.trim();

    if (comment) {
      const commentDiv = document.createElement('div');
      commentDiv.className = 'user-comment';
      commentDiv.textContent = comment;
      commentList.prepend(commentDiv);
      commentForm.reset();
    }
  });
}

// === Fetch Services
async function fetchServices(location, category, searchTerm) {
  try {
    console.log("➡️ FETCHING WITH:", {
      location,
      category,
      searchTerm
    });

    const query = new URLSearchParams();
    if (location) query.append('location', location);
    if (category) query.append('category', category);
    if (searchTerm) query.append('searchTerm', searchTerm);

    const url = `/api/services?${query.toString()}`;
    console.log("➡️ Full query URL:", url);

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const data = await response.json();
    console.log('✔️ Fetched services:', data);
    return data;

  } catch (error) {
    console.error('❌ Error fetching services:', error);
    alert("Could not fetch services. Please check your connection or input.");
    return [];
  }
}

// === Display Services
function displayResults(services) {
  resultsContainer.innerHTML = '';

  if (services.length === 0) {
    resultsContainer.innerHTML = '<p>No services found. Try a different search or suggest one!</p>';
    return;
  }

  services.forEach(service => {
    const entry = document.createElement('div');
    entry.className = 'service-card';
    const encodedAddress = encodeURIComponent(service.address || '');

    entry.innerHTML = `
      <h3>${service.name}</h3>
      <p><strong>Category:</strong> ${service.category}</p>
      <p>${service.description}</p>
      <p><strong>Address:</strong> ${service.address}</p>
      <p><strong>Contact:</strong> ${service.contact}</p>
      ${service.url ? `<p><a href="${service.url}" target="_blank">Visit Website</a></p>` : ''}
      <p><a href="https://www.google.com/maps/search/?api=1&query=${encodedAddress}" target="_blank">View on Map</a></p>
      <button class="directions-btn" data-address="${encodedAddress}">Get Directions</button>
      <hr/>
    `;
    resultsContainer.appendChild(entry);
  });

  document.querySelectorAll('.directions-btn').forEach(button => {
    button.addEventListener('click', () => {
      const destination = button.dataset.address;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destination}`;
            window.open(url, '_blank');
          },
          () => {
            const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${destination}`;
            window.open(fallbackUrl, '_blank');
          }
        );
      } else {
        const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${destination}`;
        window.open(fallbackUrl, '_blank');
      }
    });
  });
}

// === Walkthrough Logic 
function startWalkthrough() {
  if (!overlay || steps.length === 0) return;
  document.body.classList.add('no-scroll');
  overlay.classList.remove('hidden');
  steps.forEach(step => step.classList.add('hidden'));
  const firstStep = document.getElementById('step-1');
  if (firstStep) {
    firstStep.classList.remove('hidden');
  }
}

function showStep(stepId) {
  steps.forEach(step => step.classList.add('hidden'));
  const targetStep = document.getElementById(`step-${stepId}`);
  if (targetStep) {
    targetStep.classList.remove('hidden');
  }
}

function endWalkthrough() {
  if (!overlay) return;
  overlay.classList.add('hidden');
  document.body.classList.remove('no-scroll');
  steps.forEach(step => step.classList.add('hidden'));
}

if (params.get('startWalkthrough') === 'true') {
  startWalkthrough();
}

document.querySelectorAll('.walkthrough-exit-btn').forEach(btn => {
  btn.addEventListener('click', endWalkthrough);
});

document.querySelectorAll('.walkthrough-next-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const nextStepId = button.getAttribute('data-next-step');
    if (nextStepId === 'done') {
      endWalkthrough();
    } else {
      showStep(parseInt(nextStepId));
    }
  });
});

document.querySelectorAll('.walkthrough-end-btn').forEach(button => {
  button.addEventListener('click', endWalkthrough);
});

window.startWalkthrough = startWalkthrough;
window.endWalkthrough = endWalkthrough;

