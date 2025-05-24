/**
 * CV Page JavaScript
 * CITS5505 Assessment
 * 
 * This file handles the functionality for the CV page, including:
 * - Loading project data via AJAX
 * - Animating elements
 * - Interactive features
 */

$(document).ready(function() {
    // Add hover effect to profile image
    $('.profile-img-small').hover(
        function() { $(this).css('transform', 'scale(1.1)'); },
        function() { $(this).css('transform', 'scale(1.0)'); }
    );
    
    // Load projects button click handler
    $('#load-projects').on('click', function() {
        loadProjects();
        $(this).prop('disabled', true).text('Loading...');
    });
    
    // Add scroll-triggered animations to sections
    animateSections();
    
    // Trigger language dots animation on page load
    animateLanguageDots();
    
    // Initialize tooltips if Bootstrap 5 is available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
});

/**
 * Animate language proficiency dots
 */
function animateLanguageDots() {
    // Animation is handled in CSS with keyframes
    console.log("Language dots animation triggered");
    
    // Add aria-labels for better accessibility
    $('.language-level').each(function() {
        const languageName = $(this).prev('.language-name').text();
        const filledDots = $(this).find('.level-dot[class*="-dot-"]').length;
        const totalDots = $(this).find('.level-dot').length;
        
        $(this).attr('aria-label', `${languageName} proficiency: ${filledDots} out of ${totalDots}`);
    });
}

/**
 * Animate sections when they come into view
 */
function animateSections() {
    const sections = $('.contact-section, .education-section, .work-section, .skills-section, .projects-section, .references-section, .sources-section');
    
    // Add initial invisible class for animation (except first section)
    sections.each(function(index) {
        $(this).css({
            'opacity': index === 0 ? 1 : 0,
            'transform': index === 0 ? 'translateY(0)' : 'translateY(30px)'
        });
    });
    
    // Show sections as they come into view
    $(window).scroll(function() {
        sections.each(function() {
            const sectionPosition = $(this).offset().top;
            const scrollPosition = $(window).scrollTop() + $(window).height() - 100;
            
            if (sectionPosition < scrollPosition) {
                $(this).css({
                    'opacity': 1,
                    'transform': 'translateY(0)',
                    'transition': 'opacity 0.8s ease, transform 0.8s ease'
                });
            }
        });
    });
    
    // Trigger scroll event to check initial items in view
    $(window).scroll();
}

/**
 * Load projects data via AJAX simulation
 */
function loadProjects() {
    // Add loading indicators for better user experience
    $('#project-container').html(`
        <div class="col-12 text-center my-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading projects...</span>
            </div>
            <p class="mt-3">Loading projects. Please wait...</p>
        </div>
    `);
    
    // Simulate AJAX request with setTimeout
    setTimeout(function() {
        // Project data (would normally be loaded from a server)
        const projectsData = [
            {
                title: "E-commerce Website",
                description: "Responsive online store with shopping cart functionality and payment processing integration. Includes product filtering, user accounts, and order tracking.",
                technologies: "HTML, CSS, JavaScript, jQuery, Bootstrap",
                featured: true
            },
            {
                title: "Portfolio Platform",
                description: "Portfolio website template with customizable sections and themes for creative professionals. Includes lightbox gallery and contact form with validation.",
                technologies: "HTML, CSS, JavaScript, Bootstrap",
                featured: false
            },
            {
                title: "Weather Dashboard",
                description: "Real-time weather application that displays forecasts and historical weather data. Features include location search, 5-day forecast, and responsive design.",
                technologies: "HTML, CSS, JavaScript, AJAX, OpenWeather API",
                featured: true
            },
            {
                title: "Task Management App",
                description: "A simple yet powerful task management application with drag-and-drop functionality and priority marking. Includes deadline tracking and category filtering.",
                technologies: "HTML, CSS, JavaScript, jQuery UI",
                featured: false
            }
        ];
        
        displayProjects(projectsData);
        
        // Update button
        $('#load-projects').text('Projects Loaded Successfully').addClass('btn-success');
    }, 1500); // Simulate loading delay
}

/**
 * Display projects in the projects section
 * @param {Array} projects - Array of project objects
 */
function displayProjects(projects) {
    const projectContainer = $('#project-container');
    projectContainer.empty();
    
    // Create project cards
    projects.forEach((project, index) => {
        const featuredBadge = project.featured ? 
            `<span class="position-absolute top-0 end-0 badge bg-primary m-2">Featured</span>` : '';
            
        const projectCard = `
            <div class="col-md-6 col-lg-3 mb-4">
                <div class="project-card card h-100" style="animation-delay: ${index * 0.2}s">
                    ${featuredBadge}
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${project.title}</h5>
                        <p class="card-text flex-grow-1">${project.description}</p>
                        <div>
                            <p class="card-text"><small class="text-muted">Technologies: ${project.technologies}</small></p>
                            <button class="btn btn-sm btn-outline-primary project-details-btn" data-index="${index}">
                                <i class="fas fa-info-circle" aria-hidden="true"></i> View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        projectContainer.append(projectCard);
    });
    
    // Add animation to cards
    $('.project-card').each(function(index) {
        $(this).css({
            'opacity': '0',
            'transform': 'translateY(20px)'
        });
        
        setTimeout(() => {
            $(this).css({
                'opacity': '1',
                'transform': 'translateY(0)',
                'transition': 'opacity 0.5s ease, transform 0.5s ease'
            });
        }, 200 * index);
    });
    
    // Add event listener for project detail buttons
    $('.project-details-btn').on('click', function() {
        const index = $(this).data('index');
        const project = projects[index];
        
        // Show project details in a modal or expandable section
        alert(`
            Project Details:
            
            ${project.title}
            
            ${project.description}
            
            Technologies: ${project.technologies}
            
            In a real application, this would open a modal with more detailed information, screenshots, and links to the live project or code repository.
        `);
    });
}