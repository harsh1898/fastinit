
lucide.createIcons();

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
    updateIcon(true);
}

themeToggle.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateIcon(isDark);
});

function updateIcon(isDark) {
    themeToggle.innerHTML = isDark ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
    lucide.createIcons();
}

// Form Submission
const form = document.getElementById('generateForm');
const resultDiv = document.getElementById('result');
const btn = form.querySelector('button');
const input = document.getElementById('project_name');

form.onsubmit = async (e) => {
    e.preventDefault();
    btn.disabled = true;
    const originalBtn = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Processing...';
    lucide.createIcons();

    const projectName = input.value;

    try {
        // Create a hidden form to trigger native browser download
        const downloadForm = document.createElement('form');
        downloadForm.method = 'POST';
        downloadForm.action = 'https://fastinit.onrender.com/generate';
        downloadForm.style.display = 'none';

        const nameInput = document.createElement('input');
        nameInput.type = 'hidden';
        nameInput.name = 'project_name';
        nameInput.value = projectName;

        downloadForm.appendChild(nameInput);
        document.body.appendChild(downloadForm);
        downloadForm.submit();
        document.body.removeChild(downloadForm);

        resultDiv.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; gap: 8px;"><i data-lucide="check-circle" style="width: 18px; height: 18px;"></i> ${projectName} started downloading...</div>`;
        lucide.createIcons();
        resultDiv.className = 'success';
        resultDiv.style.display = 'block';
        input.value = '';

        // Reset button state after a short delay
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = originalBtn;
            lucide.createIcons();
        }, 2000);

        setTimeout(() => { resultDiv.style.display = 'none'; }, 3000);
    } catch (err) {
        resultDiv.innerHTML = "Failed to initialize project.";
        resultDiv.className = 'error';
        resultDiv.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalBtn;
        lucide.createIcons();
    }
};

input.addEventListener('input', () => { resultDiv.style.display = 'none'; });

// Carousel Logic
const track = document.getElementById('featuresTrack');
let index = 0;
const totalCards = document.querySelectorAll('.feature-card').length;

function getVisibleCards() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
}

function slide() {
    const visibleCards = getVisibleCards();
    index++;
    if (index > totalCards - visibleCards) {
        index = 0;
    }
    const cardWidth = document.querySelector('.feature-card').offsetWidth;
    const gap = 32;
    track.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
}

let slideInterval = setInterval(slide, 3000);

// Reset interval on manual interaction or resize
window.addEventListener('resize', () => {
    index = 0;
    track.style.transform = 'translateX(0)';
    clearInterval(slideInterval);
    slideInterval = setInterval(slide, 3000);
});

// Dynamic Year
document.getElementById('year').textContent = new Date().getFullYear();

