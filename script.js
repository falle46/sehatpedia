// Global variables
let articlesData = [];
let currentPage = 1;
let itemsPerPage = 6;
let currentCategory = 'all';
let currentSearchTerm = '';
let searchHistory = [];

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
        initializeTheme();
        bindEventListeners();
        displayArticles();
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
        },
        {
            id: 3,
            title: "Strategi Pencegahan Hipertensi di Usia Muda",
            category: "penyakit-tidak-menular",
            excerpt: "Hipertensi tidak hanya menyerang lansia. Pelajari cara mencegah tekanan darah tinggi sejak usia muda dengan pola hidup sehat.",
            content: "Hipertensi atau tekanan darah tinggi kini semakin banyak ditemukan pada usia muda. Faktor gaya hidup modern menjadi penyebab utama...",
            author: "Dr. Bambang Hartono",
            date: "2025-01-08",
            source: "Pusat Kesehatan Nasional",
            image: "https://images.pexels.com/photos/4386465/pexels-photo-4386465.jpeg?auto=compress&cs=tinysrgb&w=400",
            originalUrl: "https://example.com/article3"
        },
        {
            id: 4,
            title: "Obesitas: Penyebab dan Cara Mengatasinya",
            category: "penyakit-tidak-menular",
            excerpt: "Obesitas menjadi masalah kesehatan global. Ketahui penyebab obesitas dan strategi efektif untuk mencapai berat badan ideal.",
            content: "Obesitas merupakan kondisi penumpukan lemak berlebih yang dapat mengganggu kesehatan. Berbagai faktor dapat menyebabkan obesitas...",
            author: "Dr. Maya Sari",
            date: "2025-01-05",
            source: "Klinik Gizi Sehat",
            image: "https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg?auto=compress&cs=tinysrgb&w=400",
            originalUrl: "https://example.com/article4"
        },
        {
            id: 5,
            title: "Mengenal Serangan Jantung dan Pertolongan Pertama",
            category: "penyakit-jantung",
            excerpt: "Serangan jantung dapat terjadi kapan saja. Pelajari tanda-tanda serangan jantung dan cara memberikan pertolongan pertama yang tepat.",
            content: "Serangan jantung adalah kondisi darurat medis yang memerlukan penanganan segera. Mengetahui tanda-tandanya dapat menyelamatkan nyawa...",
            author: "Dr. Rudi Setiawan",
            date: "2025-01-12",
            source: "Yayasan Jantung Indonesia",
            image: "https://images.pexels.com/photos/7659564/pexels-photo-7659564.jpeg?auto=compress&cs=tinysrgb&w=400",
            originalUrl: "https://example.com/article5"
        },
        {
            id: 6,
            title: "Menjaga Kesehatan Jantung dengan Olahraga Teratur",
            category: "penyakit-jantung",
            excerpt: "Olahraga teratur adalah kunci utama menjaga kesehatan jantung. Temukan jenis olahraga yang tepat untuk jantung sehat.",
            content: "Jantung adalah organ vital yang memerlukan perawatan khusus. Olahraga teratur dapat membantu memperkuat otot jantung...",
            author: "Dr. Fitri Handayani",
            date: "2025-01-07",
            source: "Pusat Jantung Sehat",
            image: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=400",
            originalUrl: "https://example.com/article6"
        },
        {
            id: 7,
            title: "Mengelola Diabetes Tipe 2 dengan Diet Seimbang",
            category: "diabetes",
            excerpt: "Diet seimbang adalah kunci pengelolaan diabetes tipe 2. Pelajari makanan yang dianjurkan dan yang harus dihindari.",
            content: "Diabetes tipe 2 dapat dikelola dengan baik melalui pengaturan diet yang tepat. Pemilihan makanan sangat berpengaruh...",
            author: "Dr. Indra Kusuma",
            date: "2025-01-14",
            source: "Asosiasi Diabetes Indonesia",
            image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
            originalUrl: "https://example.com/article7"
        },
        {
            id: 8,
            title: "Komplikasi Diabetes dan Cara Pencegahannya",
            category: "diabetes",
            excerpt: "Diabetes yang tidak terkontrol dapat menyebabkan berbagai komplikasi serius. Ketahui komplikasi diabetes dan cara mencegahnya.",
            content: "Komplikasi diabetes dapat mempengaruhi berbagai organ tubuh. Pengendalian gula darah yang baik dapat mencegah komplikasi...",
            author: "Dr. Dewi Lestari",
            date: "2025-01-11",
            source: "Rumah Sakit Diabetes",
            image: "https://images.pexels.com/photos/6823568/pexels-photo-6823568.jpeg?auto=compress&cs=tinysrgb&w=400",
            originalUrl: "https://example.com/article8"
        },
        {
            id: 9,
            title: "Asma: Pemicu dan Cara Mengelolanya",
            category: "pernapasan",
            excerpt: "Asma dapat dipicu oleh berbagai faktor. Pelajari cara mengidentifikasi pemicu asma dan strategi pengelolaan yang efektif.",
            content: "Asma adalah penyakit pernapasan kronis yang dapat dikontrol. Mengetahui pemicu asma sangat penting untuk pencegahan...",
            author: "Dr. Ahmad Fauzi",
            date: "2025-01-09",
            source: "Klinik Pernapasan Sehat",
            image: "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=400",
            originalUrl: "https://example.com/article9"
        },
        {
            id: 10,
            title: "PPOK: Penyebab, Gejala, dan Pengobatan",
            category: "pernapasan",
            excerpt: "Penyakit Paru Obstruktif Kronis (PPOK) adalah penyakit serius yang dapat dicegah. Kenali gejala dan pilihan pengobatannya.",
            content: "PPOK merupakan penyakit paru-paru yang dapat berkembang secara progresif. Deteksi dini dan pengobatan tepat sangat penting...",
            author: "Dr. Lina Marlina",
            date: "2025-01-06",
            source: "Perhimpunan Dokter Paru Indonesia",
            image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400",
            originalUrl: "https://example.com/article10"
        },
        {
            id: 11,
            title: "Deteksi Dini Kanker Payudara",
            category: "kanker",
            excerpt: "Deteksi dini kanker payudara dapat meningkatkan angka kesembuhan. Pelajari cara melakukan pemeriksaan payudara sendiri (SADARI).",
            content: "Kanker payudara adalah salah satu kanker yang paling umum pada wanita. Deteksi dini melalui SADARI sangat penting...",
            author: "Dr. Rina Sari",
            date: "2025-01-13",
            source: "Yayasan Kanker Indonesia",
            image: "https://images.pexels.com/photos/579474/pexels-photo-579474.jpeg?auto=compress&cs=tinysrgb&w=400",
            originalUrl: "https://example.com/article11"
        },
        {
            id: 12,
            title: "Pencegahan Kanker Serviks dengan Vaksinasi HPV",
            category: "kanker",
            excerpt: "Vaksinasi HPV dapat mencegah kanker serviks. Ketahui pentingnya vaksinasi HPV dan kapan waktu yang tepat untuk mendapatkannya.",
            content: "Kanker serviks dapat dicegah melalui vaksinasi HPV dan skrining rutin. Program vaksinasi HPV telah terbukti efektif...",
            author: "Dr. Sinta Dewi",
            date: "2025-01-04",
            source: "Kementerian Kesehatan RI",
            image: "https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=400",
            originalUrl: "https://example.com/article12"
        },
        {
            id: 13,
            title: "Mengatasi Stres dan Kecemasan di Era Digital",
            category: "mental",
            excerpt: "Era digital membawa tantangan baru bagi kesehatan mental. Pelajari cara mengatasi stres dan kecemasan yang efektif.",
            content: "Kemajuan teknologi digital dapat menimbulkan stres dan kecemasan. Penting untuk mengetahui cara mengelola kesehatan mental...",
            author: "Dr. Psikologi Andi Wijaya",
            date: "2025-01-03",
            source: "Perhimpunan Psikologi Indonesia",
            image: "https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=400",
            originalUrl: "https://example.com/article13"
        },
        {
            id: 14,
            title: "Depresi pada Remaja: Tanda dan Penanganan",
            category: "mental",
            excerpt: "Depresi pada remaja sering tidak terdeteksi. Kenali tanda-tanda depresi pada remaja dan cara penanganan yang tepat.",
            content: "Depresi pada remaja memiliki karakteristik khusus yang berbeda dengan depresi pada dewasa. Penanganan dini sangat penting...",
            author: "Dr. Maya Psikologi",
            date: "2025-01-02",
            source: "Pusat Kesehatan Mental Remaja",
            image: "https://images.pexels.com/photos/5699475/pexels-photo-5699475.jpeg?auto=compress&cs=tinysrgb&w=400",
            originalUrl: "https://example.com/article14"
        },
        {
            id: 15,
            title: "Eksim: Penyebab dan Perawatan yang Tepat",
            category: "penyakit-kulit",
            excerpt: "Eksim adalah penyakit kulit yang umum terjadi. Ketahui penyebab eksim dan cara perawatan kulit yang tepat untuk mengurangi gejala.",
            content: "Eksim atau dermatitis atopik adalah kondisi kulit yang menyebabkan peradangan. Perawatan yang tepat dapat mengurangi gejala...",
            author: "Dr. Dermatologi Budi",
            date: "2025-01-01",
            source: "Perhimpunan Dokter Spesialis Kulit Indonesia",
            image: "https://images.pexels.com/photos/4386294/pexels-photo-4386294.jpeg?auto=compress&cs=tinysrgb&w=400",
            originalUrl: "https://example.com/article15"
        },
        {
            id: 16,
            title: "Jerawat pada Dewasa: Penyebab dan Solusinya",
            category: "penyakit-kulit",
            excerpt: "Jerawat tidak hanya masalah remaja. Pelajari penyebab jerawat pada dewasa dan berbagai pilihan pengobatan yang tersedia.",
            content: "Jerawat pada dewasa memiliki karakteristik dan penyebab yang berbeda dengan jerawat remaja. Pengobatan yang tepat diperlukan...",
            author: "Dr. Kulit Cantik",
            date: "2024-12-30",
            source: "Klinik Dermatologi Modern",
            image: "https://images.pexels.com/photos/3845457/pexels-photo-3845457.jpeg?auto=compress&cs=tinysrgb&w=400",
            originalUrl: "https://example.com/article16"
        }
    ];
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
    displayArticles();
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
    
    // Update active category link
    elements.categoryLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.category === category) {
            link.classList.add('active');
        }
    });
    
    // Update section title
    updateSectionTitle();
    
    // Close sidebar on mobile
    closeSidebar();
    
    displayArticles();
}

function updateSectionTitle() {
    const categoryNames = {
        'all': 'Semua Artikel',
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

// Information Retrieval Algorithm
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
    } else {
        // Sort by date if no search term
        filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    return filteredArticles;
}

function calculateRelevanceScore(article, searchTerm) {
    const searchWords = searchTerm.toLowerCase().split(' ');
    let score = 0;
    
    searchWords.forEach(word => {
        // Title matches (highest weight)
        if (article.title.toLowerCase().includes(word)) {
            score += 10;
        }
        
        // Category matches
        if (article.category.toLowerCase().includes(word)) {
            score += 8;
        }
        
        // Excerpt matches
        if (article.excerpt.toLowerCase().includes(word)) {
            score += 5;
        }
        
        // Content matches
        if (article.content.toLowerCase().includes(word)) {
            score += 3;
        }
        
        // Author matches
        if (article.author.toLowerCase().includes(word)) {
            score += 2;
        }
    });
    
    return score;
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
    const articlesHTML = articles.map(article => `
        <div class="article-card" onclick="navigateToArticle(${article.id})">
            <img src="${article.image}" alt="${article.title}" class="article-image" 
                 onerror="this.src='https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=400'">
            <div class="article-content">
                <span class="article-category">${getCategoryDisplayName(article.category)}</span>
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
    
    // Update active category
    elements.categoryLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.category === 'all') {
            link.classList.add('active');
        }
    });
    
    showSearchInfo();
    updateSectionTitle();
    closeHistoryModal();
    displayArticles();
}

function clearHistory() {
    searchHistory = [];
    localStorage.removeItem('searchHistory');
    renderHistoryList();
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