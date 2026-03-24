
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

            const formData = new FormData(form);
            const projectName = input.value;

            try {
                const response = await fetch('https://fastinit.onrender.com/generate', {
                    method: 'POST',
                    body: formData
                });
                if (!response.ok) throw new Error('API request failed');

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none'; a.href = url; a.download = `${projectName}.zip`;
                document.body.appendChild(a); a.click();
                window.URL.revokeObjectURL(url);

                resultDiv.innerHTML = "Project initialized successfully! Download started.";
                resultDiv.className = 'success';
                resultDiv.style.display = 'block';
                input.value = '';

                setTimeout(() => { resultDiv.style.display = 'none'; }, 6000);
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
 
