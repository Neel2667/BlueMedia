// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling
    const navLinks = document.querySelectorAll('.nav-link, .cta-button, .btn-primary, .btn-secondary');
    navLinks.forEach(link => {
        if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
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
    initializeContactForm();
    initializePayPal();
});

// Video Modal Functions
function openVideoModal(videoUrl) {
    const modal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('videoFrame');
    videoFrame.src = videoUrl + '?autoplay=1';
    modal.style.display = 'flex';
    
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

// PayPal Integration
function initializePayPal() {
    // Starter Package - $29
    renderPayPalButton('paypal-starter-container', 29, 'Starter Package');
    
    // Professional Package - $99
    renderPayPalButton('paypal-professional-container', 99, 'Professional Package');
    
    // Enterprise Package - $199
    renderPayPalButton('paypal-enterprise-container', 199, 'Enterprise Package');
}

function renderPayPalButton(containerId, amount, description) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: amount.toString(),
                        currency_code: 'USD'
                    },
                    description: `BlueMedia ${description} - Video Editing Service`
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                showPaymentMessage('Payment completed successfully! We\'ll contact you within 2 hours to start your project.', 'success');
                
                // Send confirmation email or track conversion here
                console.log('Payment completed:', details);
                
                // You can add analytics tracking here
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'purchase', {
                        'transaction_id': details.id,
                        'value': amount,
                        'currency': 'USD',
                        'items': [{
                            'item_id': description.toLowerCase().replace(' ', '_'),
                            'item_name': `BlueMedia ${description}`,
                            'category': 'Video Editing Service',
                            'quantity': 1,
                            'price': amount
                        }]
                    });
                }
            });
        },
        onError: function(err) {
            console.error('PayPal error:', err);
            showPaymentMessage('Payment failed. Please try again or contact us directly at hello@bluemedia.com', 'error');
        },
        onCancel: function(data) {
            console.log('Payment cancelled:', data);
            showPaymentMessage('Payment was cancelled. You can try again anytime.', 'info');
        },
        style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal',
            height: 45
        }
    }).render(`#${containerId}`);
}

function showPaymentMessage(message, type) {
    // Create a modal or notification for payment feedback
    const messageDiv = document.createElement('div');
    messageDiv.className = `payment-message ${type}`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(34, 197, 94, 0.9)' : type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(59, 130, 246, 0.9)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 400px;
        backdrop-filter: blur(10px);
        animation: slideIn 0.3s ease;
    `;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 5000);
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
                response.json().then(data => {
                    if (Object.hasOwnProperty.call(data, 'errors')) {
                        showFormMessage(data["errors"].map(error => error["message"]).join(", "), 'error');
                    } else {
                        showFormMessage('There was a problem submitting your form. Please try again.', 'error');
                    }
                });
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
    
    // Scroll to message
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Hide message after 8 seconds
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 8000);
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
    const animatedElements = document.querySelectorAll('.glow-card, .testimonial-slide, .pricing-card');
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

// Add mobile menu functionality (for future enhancement)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('mobile-active');
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
