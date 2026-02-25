// DOM Elements
const navbar = document.querySelector('.navbar');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenuIcon = mobileMenuBtn.querySelector('i');

// Scroll Event for Navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    navbar.classList.toggle('mobile-nav-active');
    
    if (navbar.classList.contains('mobile-nav-active')) {
        mobileMenuIcon.classList.remove('fa-bars');
        mobileMenuIcon.classList.add('fa-xmark');
    } else {
        mobileMenuIcon.classList.remove('fa-xmark');
        mobileMenuIcon.classList.add('fa-bars');
    }
});

// Close mobile menu when clicking a link
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('mobile-nav-active');
        mobileMenuIcon.classList.remove('fa-xmark');
        mobileMenuIcon.classList.add('fa-bars');
    });
});

// Simple Scroll Animation (Intersection Observer)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply initial styles and observer to cards and sections
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.card, .feature-item, .metric');
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `all 0.5s ease ${index % 4 * 0.1}s`;
        observer.observe(el);
    });
});
