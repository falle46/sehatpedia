// Global variables
let articlesData = [];
let currentPage = 1;
let itemsPerPage = 6;
let currentCategory = 'all';
let currentSearchTerm = '';
let searchHistory = [];
let userPreferences = {
    categories: {},
    keywords: {},
    lastSearchCategory: null
};

// DOM elements
const elements = {
    sidebarToggle: document.getElementById('sidebarToggle'),
    sidebar: document.getElementById('sidebar'),
    sidebarClose: document.getElementById('sidebarClose'),
    themeToggle: document.getElementById('themeToggle'),
    historyBtn: document.getElementById('historyBtn'),
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    searchInfo: document.getElementById('searchInfo'),
    searchTerm: document.getElementById('searchTerm'),
    clearSearch: document.getElementById('clearSearch'),
    sectionTitle: document.getElementById('sectionTitle'),
    articlesGrid: document.getElementById('articlesGrid'),
    pagination: document.getElementById('pagination'),
    historyModal: document.getElementById('historyModal'),
    closeHistoryModal: document.getElementById('closeHistoryModal'),
    historyList: document.getElementById('historyList'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
    articleModal: document.getElementById('articleModal'),
    closeArticleModal: document.getElementById('closeArticleModal'),
    articleModalTitle: document.getElementById('articleModalTitle'),
    articleModalContent: document.getElementById('articleModalContent'),
    categoryLinks: document.querySelectorAll('.category-link')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        await loadArticlesData();
        loadSearchHistory();
        loadUserPreferences();
        initializeTheme();
        bindEventListeners();
        displayPersonalizedArticles();
    } catch (error) {
        console.error('Error initializing app:', error);
        showError('Gagal memuat data aplikasi. Silakan refresh halaman.');
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

// Dummy data fallback
function getDummyData() {
    return [
        {
            id: 1,
            title: "Pencegahan Penyakit Menular di Lingkungan Kerja",
            category: "penyakit-menular",
            excerpt: "Tips praktis untuk mencegah penyebaran penyakit menular di tempat kerja, termasuk protokol kebersihan dan langkah-langkah preventif yang efektif.",
            content: "Penyakit menular dapat dengan mudah menyebar di lingkungan kerja. Artikel ini membahas berbagai strategi pencegahan yang dapat diterapkan...",
            author: "Dr. Andi Wijaya",
            date: "2025-01-15",
            source: "Jurnal Kesehatan Masyarakat",
            image: "https://images.pexels.com/photos/3786158/pexels-photo-3786158.jpeg?auto=compress&cs=tinysrgb&w=400",
            originalUrl: "https://example.com/article1"
        },
        {
            id: 2,
            title: "Mengenal Gejala Awal Infeksi Saluran Pernapasan",
            category: "penyakit-menular",
            excerpt: "Panduan lengkap mengenali gejala awal infeksi saluran pernapasan dan langkah-langkah penanganan yang tepat untuk mencegah komplikasi.",
            content: "Infeksi saluran pernapasan merupakan salah satu penyakit menular yang paling umum. Mengenali gejala awal sangat penting...",
            author: "Dr. Sari Kusuma",
            date: "2025-01-10",
            source: "Majalah Kesehatan Indonesia",
            image: "https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg?auto=compress&cs=tinysrgb&w=400",
            originalUrl: "https://example.com/article2"
        }
    ];
}

// User Preferences Management
function loadUserPreferences() {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
        userPreferences = { ...userPreferences, ...JSON.parse(savedPreferences) };
    }
}

function saveUserPreferences() {
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
}

function updateUserPreferences(searchTerm, articles) {
    // Update keyword preferences
    const keywords = searchTerm.toLowerCase().split(' ');
    keywords.forEach(keyword => {
        if (keyword.length > 2) { // Ignore short words
            userPreferences.keywords[keyword] = (userPreferences.keywords[keyword] || 0) + 1;
        }
    });

    // Update category preferences based on search results
    articles.forEach(article => {
        userPreferences.categories[article.category] = (userPreferences.categories[article.category] || 0) + 1;
    });

    // Store last search category if search results are primarily from one category
    const categoryCount = {};
    articles.forEach(article => {
        categoryCount[article.category] = (categoryCount[article.category] || 0) + 1;
    });

    const dominantCategory = Object.keys(categoryCount).reduce((a, b) => 
        categoryCount[a] > categoryCount[b] ? a : b
    );

    if (articles.length > 0 && categoryCount[dominantCategory] / articles.length > 0.6) {
        userPreferences.lastSearchCategory = dominantCategory;
    }

    saveUserPreferences();
}

// Personalized Article Recommendation System
function getPersonalizedArticles() {
    let articles = [...articlesData];
    
    // If user has search history and preferences, personalize the results
    if (Object.keys(userPreferences.categories).length > 0 || Object.keys(userPreferences.keywords).length > 0) {
        articles = articles.map(article => ({
            ...article,
            personalizedScore: calculatePersonalizedScore(article)
        })).sort((a, b) => b.personalizedScore - a.personalizedScore);
    } else {
        // For new users, sort by date
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    return articles;
}

function calculatePersonalizedScore(article) {
    let score = 0;
    
    // Base score from recency (newer articles get higher base score)
    const daysSincePublished = (new Date() - new Date(article.date)) / (1000 * 60 * 60 * 24);
    score += Math.max(0, 100 - daysSincePublished); // Max 100 points for very recent articles
    
    // Category preference score
    const categoryWeight = userPreferences.categories[article.category] || 0;
    score += categoryWeight * 50; // Each category interaction adds 50 points
    
    // Keyword relevance score
    const articleText = `${article.title} ${article.excerpt} ${article.content}`.toLowerCase();
    Object.keys(userPreferences.keywords).forEach(keyword => {
        const keywordCount = (articleText.match(new RegExp(keyword, 'g')) || []).length;
        const keywordWeight = userPreferences.keywords[keyword];
        score += keywordCount * keywordWeight * 10; // Each keyword match adds points based on user interest
    });
    
    // Boost articles from last searched category
    if (userPreferences.lastSearchCategory === article.category) {
        score += 200; // Significant boost for articles from recently searched category
    }
    
    // Diversity factor - slightly reduce score for categories user has seen too much
    const categoryOverexposure = userPreferences.categories[article.category] || 0;
    if (categoryOverexposure > 10) {
        score *= 0.9; // 10% reduction for overexposed categories
    }
    
    return score;
}

// Enhanced Information Retrieval Algorithm
function getRelevantArticles() {
    let filteredArticles = [...articlesData];
    
    // Apply category filter
    if (currentCategory !== 'all') {
        filteredArticles = filteredArticles.filter(article => 
            article.category === currentCategory
        );
    }
    
    // Apply search filter with relevance scoring
    if (currentSearchTerm) {
        filteredArticles = filteredArticles.map(article => ({
            ...article,
            relevanceScore: calculateRelevanceScore(article, currentSearchTerm)
        })).filter(article => article.relevanceScore > 0)
          .sort((a, b) => b.relevanceScore - a.relevanceScore);
        
        // Update user preferences based on search results
        updateUserPreferences(currentSearchTerm, filteredArticles);
    } else if (currentCategory === 'all') {
        // For homepage, show personalized articles
        filteredArticles = getPersonalizedArticles();
    } else {
        // For specific categories, sort by date
        filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    return filteredArticles;
}

function calculateRelevanceScore(article, searchTerm) {
    const searchWords = searchTerm.toLowerCase().split(' ');
    let score = 0;
    
    searchWords.forEach(word => {
        // Title matches (highest weight)
        const titleMatches = (article.title.toLowerCase().match(new RegExp(word, 'g')) || []).length;
        score += titleMatches * 15;
        
        // Category matches
        if (article.category.toLowerCase().includes(word)) {
            score += 12;
        }
        
        // Excerpt matches
        const excerptMatches = (article.excerpt.toLowerCase().match(new RegExp(word, 'g')) || []).length;
        score += excerptMatches * 8;
        
        // Content matches
        const contentMatches = (article.content.toLowerCase().match(new RegExp(word, 'g')) || []).length;
        score += contentMatches * 5;
        
        // Author matches
        if (article.author.toLowerCase().includes(word)) {
            score += 3;
        }
        
        // Source matches
        if (article.source.toLowerCase().includes(word)) {
            score += 2;
        }
    });
    
    // Boost score based on user's historical preferences
    if (userPreferences.categories[article.category]) {
        score += userPreferences.categories[article.category] * 2;
    }
    
    return score;
}

// Bind event listeners
function bindEventListeners() {
    // Sidebar toggle
    elements.sidebarToggle.addEventListener('click', toggleSidebar);
    elements.sidebarClose.addEventListener('click', closeSidebar);
    
    // Click outside sidebar to close
    document.addEventListener('click', (e) => {
        if (elements.sidebar.classList.contains('open') && 
            !elements.sidebar.contains(e.target) && 
            !elements.sidebarToggle.contains(e.target)) {
            closeSidebar();
        }
    });

    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Search functionality
    elements.searchBtn.addEventListener('click', performSearch);
    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    elements.clearSearch.addEventListener('click', clearSearch);

    // Category navigation
    elements.categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.currentTarget.dataset.category;
            selectCategory(category);
        });
    });

    // History modal
    elements.historyBtn.addEventListener('click', openHistoryModal);
    elements.closeHistoryModal.addEventListener('click', closeHistoryModal);
    elements.clearHistoryBtn.addEventListener('click', clearHistory);

    // Article modal
    elements.closeArticleModal.addEventListener('click', closeArticleModal);

    // Close modals when clicking outside
    elements.historyModal.addEventListener('click', (e) => {
        if (e.target === elements.historyModal) {
            closeHistoryModal();
        }
    });
    
    elements.articleModal.addEventListener('click', (e) => {
        if (e.target === elements.articleModal) {
            closeArticleModal();
        }
    });
}

// Display personalized articles on homepage
function displayPersonalizedArticles() {
    if (currentCategory === 'all' && !currentSearchTerm) {
        updateSectionTitle();
        displayArticles();
    }
}

// Sidebar functions
function toggleSidebar() {
    elements.sidebar.classList.toggle('open');
}

function closeSidebar() {
    elements.sidebar.classList.remove('open');
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

// Search functions
function performSearch() {
    const searchTerm = elements.searchInput.value.trim();
    if (searchTerm) {
        currentSearchTerm = searchTerm;
        currentPage = 1;
        addToSearchHistory(searchTerm);
        showSearchInfo();
        displayArticles();
    }
}

function clearSearch() {
    currentSearchTerm = '';
    elements.searchInput.value = '';
    hideSearchInfo();
    // Return to personalized homepage
    currentCategory = 'all';
    updateActiveCategory();
    displayPersonalizedArticles();
}

function showSearchInfo() {
    elements.searchInfo.style.display = 'flex';
    elements.searchTerm.textContent = currentSearchTerm;
}

function hideSearchInfo() {
    elements.searchInfo.style.display = 'none';
}

// Category functions
function selectCategory(category) {
    currentCategory = category;
    currentPage = 1;
    currentSearchTerm = '';
    elements.searchInput.value = '';
    hideSearchInfo();
    
    updateActiveCategory();
    updateSectionTitle();
    closeSidebar();
    displayArticles();
}

function updateActiveCategory() {
    elements.categoryLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.category === currentCategory) {
            link.classList.add('active');
        }
    });
}

function updateSectionTitle() {
    const categoryNames = {
        'all': getPersonalizedTitle(),
        'penyakit-menular': 'Artikel Penyakit Menular',
        'penyakit-tidak-menular': 'Artikel Penyakit Tidak Menular',
        'penyakit-jantung': 'Artikel Penyakit Jantung',
        'diabetes': 'Artikel Diabetes',
        'pernapasan': 'Artikel Pernapasan',
        'kanker': 'Artikel Kanker',
        'mental': 'Artikel Kesehatan Mental',
        'penyakit-kulit': 'Artikel Penyakit Kulit'
    };
    
    elements.sectionTitle.textContent = categoryNames[currentCategory] || 'Artikel Terbaru';
}

function getPersonalizedTitle() {
    if (userPreferences.lastSearchCategory) {
        const categoryNames = {
            'penyakit-menular': 'Rekomendasi: Penyakit Menular',
            'penyakit-tidak-menular': 'Rekomendasi: Penyakit Tidak Menular',
            'penyakit-jantung': 'Rekomendasi: Penyakit Jantung',
            'diabetes': 'Rekomendasi: Diabetes',
            'pernapasan': 'Rekomendasi: Pernapasan',
            'kanker': 'Rekomendasi: Kanker',
            'mental': 'Rekomendasi: Kesehatan Mental',
            'penyakit-kulit': 'Rekomendasi: Penyakit Kulit'
        };
        return categoryNames[userPreferences.lastSearchCategory] || 'Artikel Direkomendasikan';
    }
    
    if (Object.keys(userPreferences.categories).length > 0) {
        return 'Artikel Direkomendasikan untuk Anda';
    }
    
    return 'Artikel Terbaru';
}

// Display functions
function displayArticles() {
    const relevantArticles = getRelevantArticles();
    const totalPages = Math.ceil(relevantArticles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentArticles = relevantArticles.slice(startIndex, endIndex);
    
    if (currentArticles.length === 0) {
        showEmptyState();
    } else {
        renderArticles(currentArticles);
        renderPagination(totalPages);
    }
}

function renderArticles(articles) {
    const articlesHTML = articles.map((article, index) => `
        <div class="article-card" onclick="navigateToArticle(${article.id})" style="animation-delay: ${index * 0.1}s">
            <img src="${article.image}" alt="${article.title}" class="article-image" 
                 onerror="this.src='https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=400'">
            <div class="article-content">
                <span class="article-category">${getCategoryDisplayName(article.category)}</span>
                ${article.personalizedScore ? `<div class="recommendation-badge"><i class="fas fa-star"></i> Direkomendasikan</div>` : ''}
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <div class="article-meta">
                    <div class="article-date">
                        <i class="fas fa-calendar-alt"></i>
                        ${formatDate(article.date)}
                    </div>
                    <div class="article-author">
                        <i class="fas fa-user"></i>
                        ${article.author}
                    </div>
                </div>
                <a href="${article.originalUrl}" target="_blank" class="read-original-btn" 
                   onclick="event.stopPropagation()">
                    <i class="fas fa-external-link-alt"></i> Baca Artikel Asli
                </a>
            </div>
        </div>
    `).join('');
    
    elements.articlesGrid.innerHTML = articlesHTML;
}

function showEmptyState() {
    elements.articlesGrid.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-search"></i>
            <h3>Tidak ada artikel ditemukan</h3>
            <p>Coba gunakan kata kunci yang berbeda atau pilih kategori lain.</p>
        </div>
    `;
    elements.pagination.innerHTML = '';
}

function renderPagination(totalPages) {
    if (totalPages <= 1) {
        elements.pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Page numbers
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        paginationHTML += `
            <button onclick="changePage(${i})" ${i === currentPage ? 'class="active"' : ''}>
                ${i}
            </button>
        `;
    }
    
    // Next button
    paginationHTML += `
        <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    elements.pagination.innerHTML = paginationHTML;
}

function changePage(page) {
    const relevantArticles = getRelevantArticles();
    const totalPages = Math.ceil(relevantArticles.length / itemsPerPage);
    
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayArticles();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Navigation to article detail page
function navigateToArticle(articleId) {
    // Track article view for personalization
    const article = articlesData.find(a => a.id === articleId);
    if (article) {
        userPreferences.categories[article.category] = (userPreferences.categories[article.category] || 0) + 1;
        saveUserPreferences();
    }
    
    window.location.href = `article.html?id=${articleId}`;
}

// Article modal functions (kept for backward compatibility)
function openArticleModal(articleId) {
    // Redirect to article page instead of opening modal
    navigateToArticle(articleId);
}

function closeArticleModal() {
    elements.articleModal.classList.remove('open');
}

// History functions
function loadSearchHistory() {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
        searchHistory = JSON.parse(savedHistory);
    }
}

function addToSearchHistory(searchTerm) {
    const existingIndex = searchHistory.findIndex(item => item.term === searchTerm);
    
    if (existingIndex !== -1) {
        searchHistory.splice(existingIndex, 1);
    }
    
    searchHistory.unshift({
        term: searchTerm,
        date: new Date().toISOString()
    });
    
    // Keep only last 10 searches
    searchHistory = searchHistory.slice(0, 10);
    
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

function openHistoryModal() {
    renderHistoryList();
    elements.historyModal.classList.add('open');
}

function closeHistoryModal() {
    elements.historyModal.classList.remove('open');
}

function renderHistoryList() {
    if (searchHistory.length === 0) {
        elements.historyList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history"></i>
                <p>Belum ada riwayat pencarian</p>
            </div>
        `;
        return;
    }
    
    const historyHTML = searchHistory.map(item => `
        <div class="history-item" onclick="searchFromHistory('${item.term}')">
            <div>
                <div class="history-term">${item.term}</div>
                <div class="history-date">${formatDate(item.date.split('T')[0])}</div>
            </div>
            <i class="fas fa-search"></i>
        </div>
    `).join('');
    
    elements.historyList.innerHTML = historyHTML;
}

function searchFromHistory(searchTerm) {
    elements.searchInput.value = searchTerm;
    currentSearchTerm = searchTerm;
    currentPage = 1;
    currentCategory = 'all';
    
    updateActiveCategory();
    showSearchInfo();
    updateSectionTitle();
    closeHistoryModal();
    displayArticles();
}

function clearHistory() {
    searchHistory = [];
    userPreferences = {
        categories: {},
        keywords: {},
        lastSearchCategory: null
    };
    localStorage.removeItem('searchHistory');
    localStorage.removeItem('userPreferences');
    renderHistoryList();
    
    // Refresh homepage to show latest articles instead of personalized
    if (currentCategory === 'all' && !currentSearchTerm) {
        displayPersonalizedArticles();
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
    elements.articlesGrid.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Terjadi Kesalahan</h3>
            <p>${message}</p>
        </div>
    `;
}

// Make functions globally available for onclick handlers
window.changePage = changePage;
window.openArticleModal = openArticleModal;
window.navigateToArticle = navigateToArticle;
window.searchFromHistory = searchFromHistory;