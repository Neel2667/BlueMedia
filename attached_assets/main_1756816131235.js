// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling
    const navLinks = document.querySelectorAll('.nav-link, .cta-button, .btn-primary, .btn-secondary');
    navLinks.forEach(link => {
        if (link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    });

    // Initialize components
    initializeTestimonials();
    initializePricingCalculator();
    initializeContactForm();
    initializePayPal();
});

// Video Modal Functions
function openVideoModal(videoUrl) {
    const modal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('videoFrame');
    videoFrame.src = videoUrl + '?autoplay=1';
    modal.style.display = 'block';
    
    // Close modal when clicking outside
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeVideoModal();
        }
    };
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('videoFrame');
    modal.style.display = 'none';
    videoFrame.src = '';
}

// Testimonials Slider
let currentTestimonial = 1;
const totalTestimonials = 3;

function initializeTestimonials() {
    // Auto-play testimonials
    setInterval(nextTestimonial, 5000);
}

function showTestimonial(n) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    
    if (n > totalTestimonials) currentTestimonial = 1;
    if (n < 1) currentTestimonial = totalTestimonials;
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[currentTestimonial - 1].classList.add('active');
    dots[currentTestimonial - 1].classList.add('active');
}

function nextTestimonial() {
    currentTestimonial++;
    showTestimonial(currentTestimonial);
}

function previousTestimonial() {
    currentTestimonial--;
    showTestimonial(currentTestimonial);
}

function currentTestimonialSet(n) {
    currentTestimonial = n;
    showTestimonial(currentTestimonial);
}

// Pricing Calculator
function initializePricingCalculator() {
    updateCalculator();
}

function updateCalculator() {
    const videoCount = document.getElementById('videoCount').value;
    const videoDuration = document.getElementById('videoDuration').value;
    const motionGraphics = document.getElementById('motionGraphics').checked;
    const colorGrading = document.getElementById('colorGrading').checked;
    const rushOrder = document.getElementById('rushOrder').checked;
    
    // Update video count display
    document.getElementById('videoCountValue').textContent = videoCount;
    
    // Calculate base price
    let basePrice = parseInt(videoDuration);
    let totalPrice = basePrice * parseInt(videoCount);
    
    // Add-ons
    if (motionGraphics) totalPrice += 25 * parseInt(videoCount);
    if (colorGrading) totalPrice += 20 * parseInt(videoCount);
    if (rushOrder) totalPrice += 50;
    
    // Update display
    document.getElementById('totalPrice').textContent = totalPrice;
    
    // Update PayPal button
    updatePayPalButton(totalPrice);
}

// Package Selection
function selectPackage(packageName, price) {
    // Update calculator to match package
    if (packageName === 'starter') {
        document.getElementById('videoDuration').value = '15';
        document.getElementById('motionGraphics').checked = false;
        document.getElementById('colorGrading').checked = false;
        document.getElementById('rushOrder').checked = false;
    } else if (packageName === 'professional') {
        document.getElementById('videoDuration').value = '60';
        document.getElementById('motionGraphics').checked = true;
        document.getElementById('colorGrading').checked = true;
        document.getElementById('rushOrder').checked = false;
    } else if (packageName === 'enterprise') {
        document.getElementById('videoDuration').value = '100';
        document.getElementById('motionGraphics').checked = true;
        document.getElementById('colorGrading').checked = true;
        document.getElementById('rushOrder').checked = true;
    }
    
    updateCalculator();
    
    // Scroll to calculator
    document.querySelector('.pricing-calculator').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// PayPal Integration
function initializePayPal() {
    updatePayPalButton(50); // Default price
}

function updatePayPalButton(amount) {
    // Clear existing button
    const container = document.getElementById('paypal-button-container');
    container.innerHTML = '';
    
    // Render new PayPal button
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: amount.toString(),
                        currency_code: 'USD'
                    },
                    description: 'BlueMedia Video Editing Service'
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                showFormMessage('Payment completed successfully! We\'ll contact you within 2 hours to start your project.', 'success');
                
                // Send order details to backend (if needed)
                console.log('Payment completed:', details);
            });
        },
        onError: function(err) {
            console.error('PayPal error:', err);
            showFormMessage('Payment failed. Please try again or contact us directly.', 'error');
        },
        style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal'
        }
    }).render('#paypal-button-container');
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        
        // Prepare form data
        const formData = new FormData(contactForm);
        
        // Submit to Formspree (replace with your actual endpoint)
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                showFormMessage('Thank you for your message! We\'ll get back to you within 2 hours.', 'success');
                contactForm.reset();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showFormMessage('There was an error sending your message. Please try again or contact us directly at hello@bluemedia.com', 'error');
        })
        .finally(() => {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        });
    });
}

function showFormMessage(message, type) {
    const messageElement = document.getElementById('formMessage');
    messageElement.textContent = message;
    messageElement.className = `form-message ${type}`;
    messageElement.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}

// Mobile Menu Toggle (if needed in future)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('mobile-active');
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.glow-card, .blog-card, .testimonial-slide');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add scroll effect to navigation
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.nav');
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(5, 10, 17, 0.95)';
    } else {
        nav.style.background = 'rgba(5, 10, 17, 0.8)';
    }
});

// Add typing effect to hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Portfolio Filtering
document.addEventListener('DOMContentLoaded', function() {
    const portfolioFilters = document.querySelectorAll('.portfolio-filter');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active filter
            portfolioFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
});

// Enhanced floating icon interactions
document.addEventListener('DOMContentLoaded', function() {
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    floatingIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            // Pause animation on hover
            this.style.animationPlayState = 'paused';
        });
        
        icon.addEventListener('mouseleave', function() {
            // Resume animation
            this.style.animationPlayState = 'running';
        });
        
        // Add click effect
        icon.addEventListener('click', function() {
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
});
