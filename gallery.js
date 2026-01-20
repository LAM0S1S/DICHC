/**
 * Gallery Module for DIC Humanities Club
 * Handles image gallery, lightbox, and lazy loading
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery
    initGallery();
    initLightbox();
    initLazyLoading();
    initGalleryFilters();
});

/**
 * Initialize main gallery
 */
function initGallery() {
    const galleries = document.querySelectorAll('.gallery-grid');
    if (!galleries.length) return;

    galleries.forEach(gallery => {
        // Add click event to gallery items
        const items = gallery.querySelectorAll('.gallery-item');
        items.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const imgSrc = this.querySelector('img')?.src;
                const imgAlt = this.querySelector('img')?.alt;
                const caption = this.querySelector('.gallery-caption')?.textContent;
                
                if (imgSrc) {
                    openLightbox(imgSrc, imgAlt, caption);
                }
            });
            
            // Add hover effect
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.02)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    });
}

/**
 * Initialize lightbox functionality
 */
function initLightbox() {
    // Create lightbox container if it doesn't exist
    if (!document.getElementById('lightbox')) {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-nav lightbox-prev">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="lightbox-nav lightbox-next">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-caption"></div>
                <div class="lightbox-counter"></div>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        // Style the lightbox
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const content = lightbox.querySelector('.lightbox-content');
        content.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
            display: flex;
            flex-direction: column;
            align-items: center;
        `;
    }
    
    // Get lightbox elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    // Initialize gallery items array
    let currentGalleryItems = [];
    let currentIndex = 0;
    
    // Close lightbox
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.style.display || lightbox.style.display === 'none') return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateGallery('prev');
                break;
            case 'ArrowRight':
                navigateGallery('next');
                break;
        }
    });
    
    // Navigation buttons
    prevBtn.addEventListener('click', () => navigateGallery('prev'));
    nextBtn.addEventListener('click', () => navigateGallery('next'));
    
    /**
     * Open lightbox with specific image
     */
    window.openLightbox = function(imgSrc, imgAlt = '', caption = '', gallerySelector = null) {
        // Set current image
        lightboxImg.src = imgSrc;
        lightboxImg.alt = imgAlt;
        lightboxCaption.textContent = caption || imgAlt;
        
        // Get all gallery items if gallery selector is provided
        if (gallerySelector) {
            currentGalleryItems = Array.from(document.querySelectorAll(`${gallerySelector} .gallery-item img`));
        } else {
            // Find gallery from clicked element
            const clickedGallery = document.querySelector('.gallery-grid');
            if (clickedGallery) {
                currentGalleryItems = Array.from(clickedGallery.querySelectorAll('.gallery-item img'));
            }
        }
        
        // Find current index
        currentIndex = currentGalleryItems.findIndex(img => img.src === imgSrc);
        
        // Update counter
        updateLightboxCounter();
        
        // Show lightbox
        lightbox.style.display = 'flex';
        setTimeout(() => {
            lightbox.style.opacity = '1';
        }, 10);
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
    };
    
    /**
     * Close lightbox
     */
    function closeLightbox() {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
    
    /**
     * Navigate through gallery
     */
    function navigateGallery(direction) {
        if (!currentGalleryItems.length) return;
        
        if (direction === 'prev') {
            currentIndex = (currentIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
        } else {
            currentIndex = (currentIndex + 1) % currentGalleryItems.length;
        }
        
        const nextImg = currentGalleryItems[currentIndex];
        lightboxImg.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImg.src = nextImg.src;
            lightboxImg.alt = nextImg.alt;
            lightboxCaption.textContent = nextImg.alt;
            updateLightboxCounter();
            lightboxImg.style.opacity = '1';
        }, 200);
    }
    
    /**
     * Update lightbox counter
     */
    function updateLightboxCounter() {
        if (currentGalleryItems.length > 1) {
            lightboxCounter.textContent = `${currentIndex + 1} / ${currentGalleryItems.length}`;
            lightboxCounter.style.display = 'block';
        } else {
            lightboxCounter.style.display = 'none';
        }
    }
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

/**
 * Initialize gallery filters
 */
function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.gallery-filter');
    if (!filterButtons.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.dataset.filter;
            
            // Filter gallery items
            filterGalleryItems(filterValue);
        });
    });
}

/**
 * Filter gallery items based on category
 */
function filterGalleryItems(filterValue) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryContainer = document.querySelector('.gallery-grid');
    
    // Add transition class
    galleryContainer.classList.add('filtering');
    
    setTimeout(() => {
        galleryItems.forEach(item => {
            if (filterValue === 'all' || item.dataset.category === filterValue) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        // Remove transition class
        setTimeout(() => {
            galleryContainer.classList.remove('filtering');
        }, 300);
    }, 50);
}

/**
 * Load more gallery items (for pagination)
 */
function loadMoreGalleryItems() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (!loadMoreBtn) return;

    loadMoreBtn.addEventListener('click', async function() {
        const page = parseInt(this.dataset.page) || 1;
        const category = this.dataset.category || 'all';
        
        try {
            // Show loading state
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            
            // Fetch more images (simulated)
            const newItems = await fetchMoreGalleryItems(page, category);
            
            if (newItems.length > 0) {
                // Append new items to gallery
                appendGalleryItems(newItems);
                
                // Update button data
                this.dataset.page = page + 1;
                
                // Hide button if no more items
                if (newItems.length < 12) { // Assuming 12 items per page
                    this.style.display = 'none';
                }
            } else {
                this.textContent = 'No more images';
                this.disabled = true;
            }
        } catch (error) {
            console.error('Error loading more gallery items:', error);
            this.textContent = 'Error loading images';
        } finally {
            if (this.disabled !== true) {
                this.innerHTML = 'Load More';
                this.disabled = false;
            }
        }
    });
}

/**
 * Simulate fetching more gallery items
 */
async function fetchMoreGalleryItems(page, category) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulated data - replace with actual API call
    const mockImages = [
        { src: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Event+1', alt: 'Club Event', category: 'events' },
        { src: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Workshop', alt: 'Workshop Session', category: 'workshops' },
        { src: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Seminar', alt: 'Academic Seminar', category: 'seminars' },
        { src: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Cultural', alt: 'Cultural Program', category: 'cultural' }
    ];
    
    // Filter by category if not 'all'
    if (category !== 'all') {
        return mockImages.filter(img => img.category === category);
    }
    
    return mockImages;
}

/**
 * Append new gallery items to the grid
 */
function appendGalleryItems(items) {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;

    items.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.dataset.category = item.category;
        galleryItem.innerHTML = `
            <img src="${item.src}" alt="${item.alt}" loading="lazy">
            <div class="gallery-overlay">
                <div class="gallery-caption">${item.alt}</div>
                <div class="gallery-category">${item.category}</div>
            </div>
        `;
        
        // Add click event for lightbox
        galleryItem.addEventListener('click', function() {
            openLightbox(item.src, item.alt, item.alt);
        });
        
        galleryGrid.appendChild(galleryItem);
    });
    
    // Re-initialize lazy loading for new images
    initLazyLoading();
}

/**
 * Download gallery image
 */
function downloadGalleryImage(imgSrc, imgName) {
    const link = document.createElement('a');
    link.href = imgSrc;
    link.download = imgName || 'dic-humanities-club-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Share gallery image
 */
function shareGalleryImage(imgSrc, description) {
    if (navigator.share) {
        navigator.share({
            title: 'DIC Humanities Club Gallery',
            text: description || 'Check out this image from DIC Humanities Club',
            url: imgSrc
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`${description}\n\n${imgSrc}`).then(() => {
            showToast('Image link copied to clipboard!', 'success');
        });
    }
}

// Export functions for global use
window.gallery = {
    openLightbox: window.openLightbox,
    downloadGalleryImage,
    shareGalleryImage,
    loadMoreGalleryItems
};

// Initialize load more functionality
document.addEventListener('DOMContentLoaded', loadMoreGalleryItems);