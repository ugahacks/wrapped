let wrappedData = null;

// Initialize AOS when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false,
    });
    
    loadData();
});

// Fetch and populate data
async function loadData() {
    try {
        const response = await fetch('data.json');
        wrappedData = await response.json();
        populateContent();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Populate page content with data
function populateContent() {
    if (!wrappedData) return;

    // Stats page
    document.getElementById('stat-hackers').textContent = wrappedData.stats.totalHackers;
    document.getElementById('stat-projects').textContent = wrappedData.stats.totalProjects;
    document.getElementById('stat-code').textContent = (wrappedData.stats.linesOfCode / 1000000).toFixed(1) + 'M';
    document.getElementById('stat-hours').textContent = wrappedData.stats.totalHours;

    // Projects page
    wrappedData.topProjects.forEach((project, index) => {
        const num = index + 1;
        document.getElementById(`project-${num}-name`).textContent = project.name;
        document.getElementById(`project-${num}-desc`).textContent = project.description;
        
        const techSpan = document.getElementById(`project-${num}-tech`);
        techSpan.innerHTML = project.technologies.map(tech => `<span>${tech}</span>`).join('');
        
        document.getElementById(`project-${num}-votes`).textContent = `👍 ${project.votes.toLocaleString()} votes`;
    });

    // Languages page
    const languagesList = document.getElementById('languages-list');
    languagesList.innerHTML = wrappedData.languages.map((lang, idx) => `
        <div class="language-item" data-aos="slide-right" data-aos-delay="${idx * 100}">
            <div class="language-label">
                <span>${lang.name}</span>
                <span>${lang.percentage}%</span>
            </div>
            <div class="language-bar">
                <div class="language-fill" style="width: 0%; background-color: ${lang.color};" data-percentage="${lang.percentage}"></div>
            </div>
        </div>
    `).join('');

    // Workshops page
    wrappedData.topWorkshops.forEach((workshop, index) => {
        const num = index + 1;
        document.getElementById(`workshop-${num}-name`).textContent = workshop.name;
        document.getElementById(`workshop-${num}-attendees`).textContent = `${workshop.attendees} attendees`;
        document.getElementById(`workshop-${num}-instructor`).textContent = `by ${workshop.instructor}`;
    });

    // Animate language bars when they come into view
    setTimeout(() => {
        const languageFills = document.querySelectorAll('.language-fill');
        languageFills.forEach(fill => {
            const percentage = fill.getAttribute('data-percentage');
            fill.style.width = percentage + '%';
        });
    }, 500);

    // Reinitialize AOS to detect new elements
    AOS.refresh();
}

// Smooth scroll to next section
function scrollToNext() {
    const secondPage = document.querySelectorAll('.page')[1];
    secondPage.scrollIntoView({ behavior: 'smooth' });
}

// Refresh AOS on scroll
window.addEventListener('scroll', () => {
    AOS.refresh();
});
