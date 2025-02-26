
//side bar logic code
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}


document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.querySelector('.menu-btn');
    
    if (!sidebar.contains(event.target) && !menuBtn.contains(event.target) && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        
        document.getElementById('sidebar').classList.remove('active');
    });
});

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

//skill bar logic code
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-per');
    
    skillBars.forEach(skillBar => {
        if (isInViewport(skillBar) && !skillBar.style.width) {
            skillBar.style.width = `${skillBar.getAttribute('per')}%`;
        }
    });
}


//contact form logic code
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    
    clearErrors();
    
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    
    let isValid = true;
    
    
    if (name.length < 2) {
        showError('name', 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    
    if (!isValidEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    
    if (subject.length < 3) {
        showError('subject', 'Subject must be at least 3 characters long');
        isValid = false;
    }
    
    
    if (message.length < 10) {
        showError('message', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    
    if (isValid) {
        sendContactForm({ name, email, message})
        .then(()=> {
            showSuccess();
            document.getElementById('contactForm').reset();
        })
        .catch(error=>{
            showError('form', 'Failed to send message. Please try again.');
            console.error('Error:', error);
        })
    }
});

async function sendContactForm(formData) {
    const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        throw new Error('Failed to send message');
    }

    return await response.json();
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = field.nextElementSibling;
    if (errorElement) {
        field.classList.add('error');
        errorElement.textContent = message;
    } else {
       
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.querySelector('.contact-form').appendChild(errorDiv);
    }
}

function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    const inputs = document.querySelectorAll('input, textarea');
    
    errorMessages.forEach(error => error.remove());
    inputs.forEach(input => input.classList.remove('error'));
}

function showSuccess() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Message sent successfully!';
    
    document.querySelector('.contact-form').appendChild(successMessage);
    
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

        document.addEventListener('DOMContentLoaded', function() {
            const carousel = document.getElementById('projectCarousel');
            const items = carousel.querySelectorAll('.carousel-item');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const indicators = document.getElementById('indicators');
            
            let currentIndex = 0;
            const totalItems = items.length;
            
            // Create indicators
            for (let i = 0; i < totalItems; i++) {
                const indicator = document.createElement('div');
                indicator.classList.add('indicator');
                if (i === 0) {
                    indicator.classList.add('active');
                }
                indicator.setAttribute('data-index', i);
                indicators.appendChild(indicator);
                
                // Add click event to indicators
                indicator.addEventListener('click', function() {
                    goToSlide(parseInt(this.getAttribute('data-index')));
                });
            }
            
            // Auto rotate carousel every 5 seconds
            let autoRotate = setInterval(nextSlide, 5000);
            
            // Reset timer when manually navigating
            function resetTimer() {
                clearInterval(autoRotate);
                autoRotate = setInterval(nextSlide, 5000);
            }
            
            // Next slide function
            function nextSlide() {
                if (currentIndex < totalItems - 1) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateCarousel();
            }
            
            // Previous slide function
            function prevSlide() {
                if (currentIndex > 0) {
                    currentIndex--;
                } else {
                    currentIndex = totalItems - 1;
                }
                updateCarousel();
            }
            
            // Go to specific slide
            function goToSlide(index) {
                currentIndex = index;
                updateCarousel();
                resetTimer();
            }
            
            // Update carousel display
            function updateCarousel() {
                // Update carousel position
                carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
                
                // Update indicator
                const allIndicators = indicators.querySelectorAll('.indicator');
                allIndicators.forEach((ind, i) => {
                    if (i === currentIndex) {
                        ind.classList.add('active');
                    } else {
                        ind.classList.remove('active');
                    }
                });
            }
            
            // Event listeners for buttons
            prevBtn.addEventListener('click', function() {
                prevSlide();
                resetTimer();
            });
            
            nextBtn.addEventListener('click', function() {
                nextSlide();
                resetTimer();
            });
            
            // Touch events for mobile swipe
            let touchStartX = 0;
            let touchEndX = 0;
            
            carousel.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            carousel.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });
            
            function handleSwipe() {
                if (touchEndX < touchStartX - 50) {
                    // Swipe left - next slide
                    nextSlide();
                    resetTimer();
                } else if (touchEndX > touchStartX + 50) {
                    // Swipe right - previous slide
                    prevSlide();
                    resetTimer();
                }
            }
            
            // Pause auto-rotation when hovering over carousel
            carousel.addEventListener('mouseenter', () => {
                clearInterval(autoRotate);
            });
            
            carousel.addEventListener('mouseleave', () => {
                autoRotate = setInterval(nextSlide, 5000);
            });
        });

window.addEventListener('load', animateSkillBars);
window.addEventListener('scroll', animateSkillBars);

