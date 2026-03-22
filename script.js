// Site interactions: menu, nav active state, read-more, form submit, loader
function toggleReadMore(event) {
    const extraText = document.getElementById('extra-text');
    const btn = event.currentTarget || event.target;
    if (!extraText) return;
    if (extraText.style.display === 'none' || extraText.style.display === '') {
        extraText.style.display = 'block';
        btn.textContent = 'Read Less';
    } else {
        extraText.style.display = 'none';
        btn.textContent = 'Read More';
    }
}

function showSuccessPopup(event) {
    event.preventDefault();
    const popup = document.getElementById('successPopup');
    if (!popup) return;
    popup.style.display = 'flex';
    setTimeout(() => { popup.style.display = 'none'; }, 2000);
}

// Zoom state for lightbox
let currentZoom = 100;

document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.querySelector('#menu-icon');
    const navbar = document.querySelector('.navbar');

    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', () => navbar.classList.toggle('active'));
    }

    // Nav links: toggle active class and close mobile menu
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function () {
            document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
            if (navbar && navbar.classList.contains('active')) navbar.classList.remove('active');
        });
    });

    // Read More button
    const readMoreBtn = document.querySelector('.read-more-btn');
    if (readMoreBtn) readMoreBtn.addEventListener('click', toggleReadMore);

    // Contact form submit handler
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) contactForm.addEventListener('submit', showSuccessPopup);

    // Education cards: open associated file/image in lightbox modal
    document.querySelectorAll('.edu-card').forEach(card => {
        const target = card.dataset.file;
        if (target) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => openLightbox(target));
        }
    });

    // Close lightbox on X click
    const closeLightbox = document.querySelector('.close-lightbox');
    if (closeLightbox) {
        closeLightbox.addEventListener('click', () => {
            document.getElementById('lightbox').style.display = 'none';
        });
    }

    // Close lightbox on outside click
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.style.display = 'none';
        });
    }

    // Zoom button listeners
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    if (zoomInBtn) zoomInBtn.addEventListener('click', zoomIn);
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', zoomOut);

    // Gallery cards: open video modal (pass start time only)
    document.querySelectorAll('.gallery-card').forEach(card => {
        const videoUrl = card.dataset.video;
        if (videoUrl) {
            card.addEventListener('click', () => {
                const startTime = card.dataset.starttime ? parseInt(card.dataset.starttime) : 0;
                openVideoModal(videoUrl, startTime);
            });
        }
    });

    // Close video modal on X click (stop playback and clear sources)
    const closeVideoBtn = document.querySelector('.close-video');
    if (closeVideoBtn) {
        closeVideoBtn.addEventListener('click', () => {
            const modal = document.getElementById('videoModal');
            const iframe = document.getElementById('video-iframe');
            const video = document.getElementById('video-mp4');
            if (video) { try { video.pause(); } catch(e){} video.currentTime = 0; video.src = ''; }
            if (iframe) { iframe.src = ''; }
            if (modal) modal.style.display = 'none';
        });
    }

    // Close video modal on outside click (stop playback and clear sources)
    const videoModal = document.getElementById('videoModal');
    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                const iframe = document.getElementById('video-iframe');
                const video = document.getElementById('video-mp4');
                if (video) { try { video.pause(); } catch(e){} video.currentTime = 0; video.src = ''; }
                if (iframe) { iframe.src = ''; }
                videoModal.style.display = 'none';
            }
        });
    }
});

// Open file in lightbox (image or PDF) or URL in new tab
function openLightbox(filePath) {
    // Check if it's a URL (http/https)
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
        window.open(filePath, '_blank');
        return;
    }

    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const pdf = document.getElementById('lightbox-pdf');

    if (!lightbox) return;

    // Reset zoom to 100%
    currentZoom = 100;
    updateZoomDisplay();

    // Check if file is PDF or image
    if (filePath.toLowerCase().endsWith('.pdf')) {
        img.style.display = 'none';
        pdf.style.display = 'block';
        pdf.src = filePath;
    } else {
        pdf.style.display = 'none';
        img.style.display = 'block';
        img.src = filePath;
        img.style.transform = 'scale(1)';
    }

    lightbox.style.display = 'flex';
}

// Zoom in function
function zoomIn() {
    const img = document.getElementById('lightbox-img');
    if (img && img.style.display !== 'none') {
        currentZoom = Math.min(currentZoom + 10, 300);
        img.style.transform = `scale(${currentZoom / 100})`;
        updateZoomDisplay();
    }
}

// Zoom out function
function zoomOut() {
    const img = document.getElementById('lightbox-img');
    if (img && img.style.display !== 'none') {
        currentZoom = Math.max(currentZoom - 10, 50);
        img.style.transform = `scale(${currentZoom / 100})`;
        updateZoomDisplay();
    }
}

// Update zoom level display
function updateZoomDisplay() {
    const zoomLevel = document.getElementById('zoom-level');
    if (zoomLevel) zoomLevel.textContent = `${currentZoom}%`;
}

// Open video in modal player
function openVideoModal(videoUrl, startTime = 0) {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('video-iframe');
    const video = document.getElementById('video-mp4');
    
    if (!modal || !iframe || !video) return;
    
    // Hide both players first and clear sources
    iframe.style.display = 'none';
    video.style.display = 'none';
    iframe.src = '';
    video.src = '';
    
    if (videoUrl.endsWith('.mp4')) {
        video.src = videoUrl;
        video.style.display = 'block';
        video.load();
        try { video.currentTime = startTime; } catch (e) {}
        video.play();
    } else {
        iframe.src = videoUrl;
        iframe.style.display = 'block';
    }

    modal.style.display = 'flex';
}

// GIF loader: wait for full load then fade
window.addEventListener('load', () => {
    const loader = document.getElementById('gif-loader');
    if (!loader) return;
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';
    }, 2000);
});
