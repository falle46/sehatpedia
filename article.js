// Global variables
let articlesData = [];
let currentArticle = null;

// DOM elements
const elements = {
    backBtn: document.getElementById('backBtn'),
    homeBtn: document.getElementById('homeBtn'),
    themeToggle: document.getElementById('themeToggle'),
    articleDetail: document.getElementById('articleDetail'),
    relatedArticles: document.getElementById('relatedArticles'),
    relatedArticlesGrid: document.getElementById('relatedArticlesGrid')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        await loadArticlesData();
        initializeTheme();
        bindEventListeners();
        loadArticleFromURL();
    } catch (error) {
        console.error('Error initializing app:', error);
        showError('Gagal memuat artikel. Silakan coba lagi.');
    }
}

// Load articles data from JSON
async function loadArticlesData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        articlesData = await response.json();
    } catch (error) {
        console.error('Error loading articles data:', error);
        // Fallback to dummy data if JSON fails to load
        articlesData = getDummyData();
    }
}

// Dummy data fallback (same as in script.js)
function getDummyData() {
    return [
        {
            id: 1,
            title: "Pencegahan Penyakit Menular di Lingkungan Kerja",
            category: "penyakit-menular",
            excerpt: "Tips praktis untuk mencegah penyebaran penyakit menular di tempat kerja, termasuk protokol kebersihan dan langkah-langkah preventif yang efektif.",
            content: "Penyakit menular dapat dengan mudah menyebar di lingkungan kerja karena tingginya interaksi antar karyawan. Beberapa langkah pencegahan yang dapat diterapkan meliputi: mencuci tangan secara teratur dengan sabun dan air mengalir, menggunakan hand sanitizer berbasis alkohol, menjaga jarak fisik minimal 1 meter dari rekan kerja, menggunakan masker saat berada di ruang tertutup, membersihkan dan mendisinfeksi permukaan yang sering disentuh, meningkatkan ventilasi udara di ruangan, tidak datang bekerja saat sakit, dan melakukan vaksinasi sesuai rekomendasi. Implementasi protokol kesehatan yang konsisten dapat mengurangi risiko penularan penyakit menular hingga 80% di lingkungan kerja.",
            author: "Dr. Andi Wijaya",
            date: "2025-01-15",
            source: "Jurnal Kesehatan Masyarakat",
            image: "https://images.pexels.com/photos/3786158/pexels-photo-3786158.jpeg?auto=compress&cs=tinysrgb&w=800",
            originalUrl: "https://example.com/pencegahan-penyakit-menular-kerja"
        },
        {
            id: 2,
            title: "Mengenal Gejala Awal Infeksi Saluran Pernapasan",
            category: "penyakit-menular",
            excerpt: "Panduan lengkap mengenali gejala awal infeksi saluran pernapasan dan langkah-langkah penanganan yang tepat untuk mencegah komplikasi.",
            content: "Infeksi saluran pernapasan merupakan salah satu penyakit menular yang paling umum, terutama pada musim hujan dan peralihan cuaca. Gejala awal yang perlu diwaspadai meliputi: batuk kering atau berdahak, pilek dan hidung tersumbat, sakit tenggorokan, demam ringan hingga sedang, sakit kepala, kelelahan dan malaise, nyeri otot, dan kehilangan nafsu makan. Penanganan dini sangat penting untuk mencegah komplikasi. Langkah yang dapat dilakukan antara lain: istirahat yang cukup, minum banyak cairan hangat, berkumur dengan air garam, menggunakan humidifier, konsumsi makanan bergizi, dan segera berkonsultasi dengan dokter jika gejala memburuk atau berlangsung lebih dari 7 hari.",
            author: "Dr. Sari Kusuma",
            date: "2025-01-10",
            source: "Majalah Kesehatan Indonesia",
            image: "https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg?auto=compress&cs=tinysrgb&w=800",
            originalUrl: "https://example.com/gejala-infeksi-saluran-pernapasan"
        }
        // Add more dummy data as needed...
    ];
}

// Bind event listeners
function bindEventListeners() {
    elements.backBtn.addEventListener('click', goBack);
    elements.homeBtn.addEventListener('click', goHome);
    elements.themeToggle.addEventListener('click', toggleTheme);
}

// Theme functions
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = elements.themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Navigation functions
function goBack() {
    window.history.back();
}

function goHome() {
    window.location.href = 'index.html';
}

// Load article from URL parameter
function loadArticleFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (articleId) {
        const article = articlesData.find(a => a.id == articleId);
        if (article) {
            displayArticle(article);
            loadRelatedArticles(article);
        } else {
            showError('Artikel tidak ditemukan.');
        }
    } else {
        showError('ID artikel tidak valid.');
    }
}

// Display article content
function displayArticle(article) {
    currentArticle = article;
    
    // Update page title
    document.title = `${article.title} - Health Info Portal`;
    
    const articleHTML = `
        <div class="article-header">
            <div class="article-category-badge">
                <span class="article-category">${getCategoryDisplayName(article.category)}</span>
            </div>
            <h1 class="article-title">${article.title}</h1>
            <div class="article-meta">
                <div class="article-author">
                    <i class="fas fa-user"></i>
                    <span>${article.author}</span>
                </div>
                <div class="article-date">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${formatDate(article.date)}</span>
                </div>
                <div class="article-source">
                    <i class="fas fa-newspaper"></i>
                    <span>${article.source}</span>
                </div>
            </div>
        </div>
        
        <div class="article-image-container">
            <img src="${article.image}" alt="${article.title}" class="article-image"
                 onerror="this.src='https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=800'">
        </div>
        
        <div class="article-excerpt">
            <p><strong>Ringkasan:</strong> ${article.excerpt}</p>
        </div>
        
        <div class="article-content">
            ${formatArticleContent(article.content)}
        </div>
        
        <div class="article-actions">
            <a href="${article.originalUrl}" target="_blank" class="read-original-btn">
                <i class="fas fa-external-link-alt"></i>
                Baca Artikel Lengkap di Sumber Asli
            </a>
            <button class="share-btn" onclick="shareArticle()">
                <i class="fas fa-share-alt"></i>
                Bagikan Artikel
            </button>
        </div>
    `;
    
    elements.articleDetail.innerHTML = articleHTML;
}

// Format article content with paragraphs
function formatArticleContent(content) {
    // Split content by periods and create paragraphs
    const sentences = content.split('. ');
    let paragraphs = [];
    let currentParagraph = [];
    
    sentences.forEach((sentence, index) => {
        currentParagraph.push(sentence + (index < sentences.length - 1 ? '.' : ''));
        
        // Create new paragraph every 3-4 sentences
        if (currentParagraph.length >= 3 || index === sentences.length - 1) {
            paragraphs.push(currentParagraph.join(' '));
            currentParagraph = [];
        }
    });
    
    return paragraphs.map(paragraph => `<p>${paragraph}</p>`).join('');
}

// Load related articles
function loadRelatedArticles(article) {
    const relatedArticles = articlesData
        .filter(a => a.id !== article.id && a.category === article.category)
        .slice(0, 3);
    
    if (relatedArticles.length > 0) {
        elements.relatedArticles.style.display = 'block';
        renderRelatedArticles(relatedArticles);
    }
}

// Render related articles
function renderRelatedArticles(articles) {
    const articlesHTML = articles.map(article => `
        <div class="related-article-card" onclick="navigateToArticle(${article.id})">
            <img src="${article.image}" alt="${article.title}" class="related-article-image"
                 onerror="this.src='https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=400'">
            <div class="related-article-content">
                <h4 class="related-article-title">${article.title}</h4>
                <p class="related-article-excerpt">${article.excerpt.substring(0, 100)}...</p>
                <div class="related-article-meta">
                    <span class="related-article-author">${article.author}</span>
                    <span class="related-article-date">${formatDate(article.date)}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    elements.relatedArticlesGrid.innerHTML = articlesHTML;
}

// Navigation to another article
function navigateToArticle(articleId) {
    window.location.href = `article.html?id=${articleId}`;
}

// Share article function
function shareArticle() {
    if (navigator.share && currentArticle) {
        navigator.share({
            title: currentArticle.title,
            text: currentArticle.excerpt,
            url: window.location.href
        }).catch(console.error);
    } else if (currentArticle) {
        // Fallback: copy to clipboard
        const shareText = `${currentArticle.title}\n\n${currentArticle.excerpt}\n\n${window.location.href}`;
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Link artikel telah disalin ke clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Link artikel telah disalin ke clipboard!');
        });
    }
}

// Utility functions
function getCategoryDisplayName(category) {
    const categoryNames = {
        'penyakit-menular': 'Penyakit Menular',
        'penyakit-tidak-menular': 'Penyakit Tidak Menular',
        'penyakit-jantung': 'Penyakit Jantung',
        'diabetes': 'Diabetes',
        'pernapasan': 'Pernapasan',
        'kanker': 'Kanker',
        'mental': 'Kesehatan Mental',
        'penyakit-kulit': 'Penyakit Kulit'
    };
    
    return categoryNames[category] || category;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showError(message) {
    elements.articleDetail.innerHTML = `
        <div class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Terjadi Kesalahan</h3>
            <p>${message}</p>
            <button onclick="goHome()" class="back-home-btn">
                <i class="fas fa-home"></i>
                Kembali ke Beranda
            </button>
        </div>
    `;
}

// Make functions globally available
window.navigateToArticle = navigateToArticle;
window.shareArticle = shareArticle;
window.goHome = goHome;