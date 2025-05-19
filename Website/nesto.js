// Glavni JavaScript fajl za funkcionalnosti sajta

document.addEventListener('DOMContentLoaded', function() {
    // Mobilni meni toggle
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰ Meni';
    document.querySelector('header .container').prepend(menuToggle);
    
    menuToggle.addEventListener('click', function() {
        document.querySelector('nav').classList.toggle('active');
    });

    // Glatki scroll za anchor linkove
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Kontakt forma validacija
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();
            const message = this.querySelector('textarea').value.trim();
            
            // Prosta validacija
            if (!name || !email || !message) {
                alert('Molimo popunite sva polja!');
                return;
            }
            
            if (!validateEmail(email)) {
                alert('Unesite validnu email adresu!');
                return;
            }
            
            // Ako imamo PHP backend, ovde bi išao AJAX poziv
            alert('Hvala na poruci! Kontaktiraćemo vas uskoro.');
            this.reset();
        });
    }

    // Funkcija za validaciju emaila
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Dinamičko učitavanje blog postova
    if (document.getElementById('blog')) {
        fetchBlogPosts();
    }

    // Animacija engine kartica
    const engineCards = document.querySelectorAll('.engine-card');
    engineCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        });
    });
});

// Funkcija za fetch blog postova (može se koristiti sa pravim API-jem)
async function fetchBlogPosts() {
    try {
        // Ovo je simulacija - u praksi bi bilo fetch('/api/blog')
        const mockPosts = [
            {
                title: "Unity vs Godot: Koji je bolji za 2D igre?",
                excerpt: "Uporedili smo performanse Unity-a i Godot-a za 2D game development...",
                date: "2023-05-15"
            },
            {
                title: "Unreal Engine 5: Nova era u game developmentu",
                excerpt: "Najnovije karakteristike UE5 revolucioniraju način na koji pravimo igre...",
                date: "2023-04-22"
            }
        ];

        const blogContainer = document.querySelector('.blog-posts');
        blogContainer.innerHTML = ''; // Očisti postojeće
        
        mockPosts.forEach(post => {
            const article = document.createElement('article');
            article.innerHTML = `
                <h3>${post.title}</h3>
                <small>${formatDate(post.date)}</small>
                <p>${post.excerpt}</p>
                <a href="#" class="read-more">Pročitaj više</a>
            `;
            blogContainer.appendChild(article);
        });
    } catch (error) {
        console.error('Greška pri učitavanju blog postova:', error);
    }
}

// Pomocna funkcija za formatiranje datuma
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('sr-RS', options);
}