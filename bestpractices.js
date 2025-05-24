/**
 * Best Practices JavaScript
 * CITS5505 Assessment
 * 
 * This script manages the web development best practices checklist functionality:
 * - Displays and categorizes best practices
 * - Handles user interactions (checking practices)
 * - Tracks and visualizes user progress
 * - Provides rewards upon completion
 */

// List of web development best practices
const bestPractices = [
    // HTML Category Practices
    {
        id: 'semantic-html',
        title: 'Use Semantic HTML',
        description: 'Semantic HTML elements clearly describe their meaning to both browsers and developers. Proper use of HTML semantic tags (header, nav, section, etc.) improves accessibility, SEO, and code readability.',
        category: 'html'
    },
    {
        id: 'accessibility',
        title: 'Ensure Accessibility (WCAG Compliance)',
        description: 'Design for all users by following Web Content Accessibility Guidelines (WCAG). Use proper contrast ratios, alt text for images, keyboard navigation, and ARIA attributes where needed.',
        category: 'html'
    },
    {
        id: 'semantic-class-names',
        title: 'Choose Semantic Class Names',
        description: 'Use descriptive, purpose-based class names instead of presentation-based names. This creates more maintainable code and separates structure from presentation.',
        category: 'html'
    },
    {
        id: 'html-doctype',
        title: 'Include Proper DOCTYPE',
        description: 'Always declare the correct document type with <!DOCTYPE html> at the beginning of HTML documents to ensure browsers render your page in standards mode.',
        category: 'html'
    },
    
    // CSS Category Practices
    {
        id: 'responsive-design',
        title: 'Implement Responsive Design',
        description: 'Ensure your website functions well on all devices by using media queries, flexible grids, and relative units (%, em, rem). This improves user experience and is a ranking factor for search engines.',
        category: 'css'
    },
    {
        id: 'css-organization',
        title: 'Organize CSS with Methodology',
        description: 'Use a CSS methodology like BEM (Block, Element, Modifier), SMACSS, or OOCSS to write maintainable, scalable, and more readable styles that are easier to debug and update.',
        category: 'css'
    },
    {
        id: 'css-variables',
        title: 'Use CSS Custom Properties (Variables)',
        description: 'Implement CSS variables for consistent theming, easier maintenance, and more dynamic styles. They make global color or size changes simple and reduce repetition in your CSS.',
        category: 'css'
    },
    {
        id: 'css-prefixes',
        title: 'Use CSS Vendor Prefixes',
        description: 'Ensure cross-browser compatibility by using vendor prefixes for CSS properties that require them, or utilize tools like Autoprefixer to add them automatically.',
        category: 'css'
    },
    
    // JavaScript Category Practices
    {
        id: 'defer-js',
        title: 'Defer JavaScript Loading',
        description: 'Use defer or async attributes to prevent JavaScript from blocking page rendering, improving initial load times and user experience, especially on slower connections.',
        category: 'js'
    },
    {
        id: 'error-handling',
        title: 'Implement Proper Error Handling',
        description: 'Use try/catch blocks and error event listeners in JavaScript to gracefully handle errors without breaking the user experience or leaving users wondering what went wrong.',
        category: 'js'
    },
    {
        id: 'lazy-loading',
        title: 'Implement Lazy Loading',
        description: 'Defer loading off-screen images and videos until they\'re needed, reducing initial page load time and saving data for users on limited bandwidth connections.',
        category: 'js'
    },
    {
        id: 'strict-mode',
        title: 'Enable Strict Mode',
        description: 'Add "use strict"; at the top of JavaScript files to enforce safer coding practices, catch common mistakes, and prevent the use of potentially problematic features.',
        category: 'js'
    },
    
    // Generic Category Practices
    {
        id: 'minify-resources',
        title: 'Minify CSS and JavaScript',
        description: 'Removing unnecessary characters (whitespace, comments, etc.) from your code without changing functionality reduces file size, leading to faster loading times and improved performance.',
        category: 'generic'
    },
    {
        id: 'image-optimization',
        title: 'Optimize Images',
        description: 'Compress images, use appropriate formats (WebP, AVIF), and implement responsive images with srcset to reduce page load times and save bandwidth for users.',
        category: 'generic'
    },
    {
        id: 'https',
        title: 'Implement HTTPS',
        description: 'Secure your website with HTTPS to protect user data, build trust, improve SEO (Google uses HTTPS as a ranking signal), and enable modern features like service workers.',
        category: 'generic'
    }
];

// Set success criteria
const REQUIRED_FOR_SUCCESS = 12;
const TOTAL_PRACTICES = bestPractices.length;

// Initialize when DOM is fully loaded
$(document).ready(function() {
    // Display total number of practices
    $('#total-practices').text(TOTAL_PRACTICES);
    
    // Render best practices list
    renderBestPractices();
    
    // Load saved state from local storage
    loadSavedState();
    
    // Update the progress display
    updateProgress();
    
    // Add event listener for reset button
    $('#reset-progress').on('click', function() {
        if (confirm('Are you sure you want to reset your progress? This action cannot be undone.')) {
            resetProgress();
        }
    });
    
    // Initialize circular progress
    updateCircularProgress(0);
    
    // Ensure everything is properly rendered
    setTimeout(forceUpdateProgress, 500);
});

/**
 * Render the list of best practices
 * Creates DOM elements for each practice with description and checkbox
 */
function renderBestPractices() {
    // Group practices by category
    const htmlPractices = bestPractices.filter(p => p.category === 'html');
    const cssPractices = bestPractices.filter(p => p.category === 'css');
    const jsPractices = bestPractices.filter(p => p.category === 'js');
    const genericPractices = bestPractices.filter(p => p.category === 'generic');
    
    // Clear loading indicators
    $('#html-practices, #css-practices, #js-practices, #generic-practices').empty();
    
    // Function to create practice cards
    function createPracticeCard(practice, columnClass) {
        // Determine tag type (basic, intermediate, or advanced)
        let tagClass = 'tag-essential';
        let tagText = 'Essential';
        
        if (practice.id.includes('responsive') || practice.id.includes('organization') || practice.id.includes('variables')) {
            tagClass = 'tag-intermediate';
            tagText = 'Intermediate';
        } else if (practice.id.includes('performance') || practice.id.includes('global') || practice.id.includes('loading')) {
            tagClass = 'tag-advanced';
            tagText = 'Advanced';
        }
        
        // Create example code (only for certain practices)
        let codeExample = '';
        if (practice.id === 'semantic-html') {
            codeExample = `<div class="code-sample">&lt;header&gt;&lt;/header&gt;
&lt;nav&gt;&lt;/nav&gt;
&lt;article&gt;&lt;/article&gt;</div>`;
        } else if (practice.id === 'image-optimization') {
            codeExample = `<div class="code-sample">&lt;img srcset="img-sm.jpg 400w, img-lg.jpg 800w"
     sizes="(max-width: 600px) 400px, 800px"
     src="img-lg.jpg" alt="Responsive image"&gt;</div>`;
        } else if (practice.id === 'css-organization') {
            codeExample = `<div class="code-sample">.block {}\n.block__element {}\n.block--modifier {}</div>`;
        } else if (practice.id === 'defer-js') {
            codeExample = `<div class="code-sample">&lt;script src="script.js" defer&gt;&lt;/script&gt;</div>`;
        } else if (practice.id === 'strict-mode') {
            codeExample = `<div class="code-sample">"use strict";</div>`;
        } else if (practice.id === 'css-variables') {
            codeExample = `<div class="code-sample">:root {
  --primary-color: #3f51b5;
}

.button {
  background-color: var(--primary-color);
}</div>`;
        }
        
        // Build card HTML
        return `
        <div class="${columnClass}">
            <div class="practice-card" id="card-${practice.id}">
                <div class="card-header">
                    <h3>${practice.title}</h3>
                    <span class="practice-tag ${tagClass}">${tagText}</span>
                </div>
                <div class="card-body">
                    <div class="card-description">
                        <p>${practice.description}</p>
                        ${codeExample}
                    </div>
                    <div class="mt-3">
                        <label class="checkbox-toggle">
                            <input type="checkbox" class="practice-check" id="${practice.id}" aria-label="${practice.title}">
                            <span class="toggle-slider"></span>
                        </label>
                        <span class="ms-2">My website implements this practice</span>
                    </div>
                </div>
            </div>
        </div>`;
    }
    
    // Render cards for each category
    htmlPractices.forEach(practice => {
        $('#html-practices').append(createPracticeCard(practice, 'col-md-6'));
    });
    
    cssPractices.forEach(practice => {
        $('#css-practices').append(createPracticeCard(practice, 'col-md-6'));
    });
    
    jsPractices.forEach(practice => {
        $('#js-practices').append(createPracticeCard(practice, 'col-md-6'));
    });
    
    genericPractices.forEach(practice => {
        $('#generic-practices').append(createPracticeCard(practice, 'col-md-4'));
    });
    
    // Add event listeners to checkboxes
    $('.practice-check').on('change', function() {
        const practiceId = $(this).attr('id');
        const cardElement = $(`#card-${practiceId}`);
        
        if ($(this).is(':checked')) {
            cardElement.addClass('checked');
        } else {
            cardElement.removeClass('checked');
        }
        
        // Save state and update progress
        saveState();
        updateProgress();
    });
    
    // Adjust card heights to maintain consistency
    equalizeCardHeights();
}

/**
 * Make card heights consistent within each category
 * This ensures a uniform look despite varying content length
 */
function equalizeCardHeights() {
    // Adjust heights by category
    ['html', 'css', 'js', 'generic'].forEach(category => {
        const cards = $(`#${category}-practices .practice-card`);
        let maxHeight = 0;
        
        // Reset heights
        cards.css('height', 'auto');
        
        // Find tallest card
        cards.each(function() {
            const height = $(this).outerHeight();
            maxHeight = Math.max(maxHeight, height);
        });
        
        // Apply height
        if (maxHeight > 0) {
            cards.css('height', `${maxHeight}px`);
        }
    });
}

/**
 * Save current checkbox states to local storage
 * This allows the user's progress to persist between sessions
 */
function saveState() {
    const state = {};
    
    $('.practice-check').each(function() {
        const id = $(this).attr('id');
        state[id] = $(this).is(':checked');
    });
    
    localStorage.setItem('bestPracticesState', JSON.stringify(state));
}

/**
 * Load saved state from local storage
 * Restores the user's previous selections
 */
function loadSavedState() {
    const savedState = localStorage.getItem('bestPracticesState');
    
    if (savedState) {
        const state = JSON.parse(savedState);
        
        for (const id in state) {
            const checkbox = $(`#${id}`);
            checkbox.prop('checked', state[id]);
            
            // Update card state as well
            if (state[id]) {
                $(`#card-${id}`).addClass('checked');
            }
        }
    }
    
    // Delay execution to ensure DOM is fully loaded
    setTimeout(updateProgress, 100);
}

/**
 * Reset all progress
 * Clears local storage and unchecks all checkboxes
 */
function resetProgress() {
    // Clear all checkboxes
    $('.practice-check').prop('checked', false);
    $('.practice-card').removeClass('checked');
    
    // Remove from local storage
    localStorage.removeItem('bestPracticesState');
    
    // Update the display
    updateProgress();
    
    // Show feedback to user
    alert('Your progress has been reset!');
}

/**
 * Update progress display
 * Calculates completion percentage and updates progress indicators
 */
function updateProgress() {
    // Count checked practices
    const checkedCount = $('.practice-check:checked').length;
    
    // Update count display
    $('#completed-practices').text(checkedCount);
    
    // Calculate percentage
    const percentage = Math.round((checkedCount / TOTAL_PRACTICES) * 100);
    
    // Update circular progress
    updateCircularProgress(percentage);
    
    // Check if success criteria met
    if (checkedCount >= REQUIRED_FOR_SUCCESS) {
        showSuccessMessage();
        // Add success state class
        $('.circular-progress').addClass('success-state');
    } else {
        hideSuccessMessage();
        // Remove success state class
        $('.circular-progress').removeClass('success-state');
    }
}

/**
 * Force update progress display
 * Ensures progress is correctly displayed even when loaded from cache
 */
function forceUpdateProgress() {
    // Count checked practices
    const checkedCount = $('.practice-check:checked').length;
    
    // Only proceed if we have checked practices
    if (checkedCount > 0) {
      // Calculate percentage
      const percentage = Math.round((checkedCount / TOTAL_PRACTICES) * 100);
      
      // Force update all UI elements
      updateCircularProgress(percentage);
      
      // Check if success criteria is met
      if (checkedCount >= REQUIRED_FOR_SUCCESS) {
        $('#success-message').removeClass('d-none');
        $('.circular-progress').addClass('success-state');
      }
    }
}

/**
 * Update the circular progress indicator
 * @param {number} percentage - Completion percentage
 */
function updateCircularProgress(percentage) {
    const circle = document.getElementById('progress-circle');
    if (!circle) return; // Safety check
    
    const radius = circle.getAttribute('r');
    const circumference = 2 * Math.PI * radius;
    
    // Set total length
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    
    // Set offset to show progress
    const offset = circumference - (percentage / 100 * circumference);
    circle.style.strokeDashoffset = offset;
    
    // Update percentage text
    const progressPercentage = document.getElementById('progress-percentage');
    if (progressPercentage) {
        progressPercentage.textContent = `${percentage}%`;
    }
}

/**
 * Show success message and fetch random dog image
 * Only fetches a new image if the success message is not already visible
 */
function showSuccessMessage() {
    // Only fetch new image if success message is not already visible
    if ($('#success-message').hasClass('d-none')) {
        // Show success message
        $('#success-message').removeClass('d-none');
        
        // Fetch random dog image using AJAX
        fetchRandomDogImage();
    }
}

/**
 * Hide success message
 * Removes the success message and clears the animal container
 */
function hideSuccessMessage() {
    $('#success-message').addClass('d-none');
    // Clear animal container
    $('#animal-container').empty();
}

/**
 * Fetch random dog image from Dog API
 * Handles loading state, success, and error cases
 */
function fetchRandomDogImage() {
    // Show loading indicator
    $('#animal-container').html('<div class="text-center"><i class="fas fa-spinner fa-spin fa-2x"></i><p class="mt-2">Loading cute animal image...</p></div>');
    
    $.ajax({
        url: 'https://dog.ceo/api/breeds/image/random',
        method: 'GET',
        dataType: 'json',
        timeout: 10000, // 10 second timeout
        success: function(response) {
            if (response.status === 'success') {
                const imageUrl = response.message;
                const imageElement = `
                    <div class="reward-image-container">
                        <img src="${imageUrl}" alt="Cute dog as a reward" class="img-fluid rounded shadow">
                        <div class="mt-3">
                            <p class="reward-message">Congratulations! You've mastered web development best practices!</p>
                            <button class="btn btn-sm btn-success" id="new-dog-btn">
                                <i class="fas fa-sync-alt"></i> Show me another dog
                            </button>
                        </div>
                    </div>`;
                $('#animal-container').html(imageElement);
                
                // Add click event
                $('#new-dog-btn').on('click', fetchRandomDogImage);
            } else {
                // Handle API error
                $('#animal-container').html('<p><i class="fas fa-exclamation-triangle"></i> Sorry, couldn\'t fetch a cute animal image. Try again later!</p>');
            }
        },
        error: function(xhr, status, error) {
            // Handle AJAX error
            $('#animal-container').html('<p><i class="fas fa-exclamation-triangle"></i> Sorry, couldn\'t fetch a cute animal image. Try again later!</p>');
            
            // Add a retry button
            $('#animal-container').append('<button class="btn btn-sm btn-success mt-2" id="retry-dog-btn"><i class="fas fa-redo"></i> Try Again</button>');
            $('#retry-dog-btn').on('click', fetchRandomDogImage);
        }
    });
}

// Adjust card heights when window is resized
$(window).on('resize', function() {
    equalizeCardHeights();
});

// Handle page loaded from cache (when using back button)
$(window).on('pageshow', function() {
    setTimeout(function() {
        forceUpdateProgress();
        equalizeCardHeights();
    }, 300);
});