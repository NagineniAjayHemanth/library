// Sample book data
const books = [
    { name: "Python Basics", sizeMB: 10, path: "/books/python.pdf", category: "Programming" },
    { name: "Java Fundamentals", sizeMB: 8, path: "/books/java.pdf", category: "Programming" },
    { name: "Rust Programming", sizeMB: 5, path: "/books/rust.pdf", category: "Programming" },
    { name: "Database Systems", sizeMB: 7, path: "/books/dbms.pdf", category: "Database" },
    { name: "Linux Guide", sizeMB: 12, path: "/books/linux.pdf", category: "Networking" },
    { name: "Web Security", sizeMB: 6, path: "/books/security.pdf", category: "Security" },
    { name: "Machine Learning", sizeMB: 15, path: "/books/ml.pdf", category: "AI" },
    { name: "UI/UX Design", sizeMB: 9, path: "/books/design.pdf", category: "Design" },
    { name: "Networking Basics", sizeMB: 11, path: "/books/network.pdf", category: "Networking" },
    { name: "Advanced JavaScript", sizeMB: 14, path: "/books/js.pdf", category: "Programming" },
    { name: "Cybersecurity Essentials", sizeMB: 13, path: "/books/cybersec.pdf", category: "Security" },
    { name: "NoSQL Databases", sizeMB: 10, path: "/books/nosql.pdf", category: "Database" },
    { name: "Cloud Computing", sizeMB: 16, path: "/books/cloud.pdf", category: "Networking" },
    { name: "Data Structures", sizeMB: 7, path: "/books/ds.pdf", category: "Programming" },
    { name: "Blockchain Technology", sizeMB: 18, path: "/books/blockchain.pdf", category: "Security" },
    { name: "Mobile App Design", sizeMB: 11, path: "/books/mobile.pdf", category: "Design" },
    { name: "Deep Learning", sizeMB: 20, path: "/books/deeplearning.pdf", category: "AI" },
    { name: "System Architecture", sizeMB: 9, path: "/books/architecture.pdf", category: "Other" },
    { name: "DevOps Practices", sizeMB: 12, path: "/books/devops.pdf", category: "Other" },
    { name: "API Development", sizeMB: 8, path: "/books/api.pdf", category: "Programming" },
    { name: "React Development", sizeMB: 14, path: "/books/react.pdf", category: "Programming" },
    { name: "Docker Guide", sizeMB: 7, path: "/books/docker.pdf", category: "Other" },
    { name: "Kubernetes Basics", sizeMB: 16, path: "/books/kubernetes.pdf", category: "Networking" }
];

// Configuration
const SHELF_CAPACITY_MB = 30;
const SCALE_PX_PER_MB = 6;

// DOM elements
const shelvesContainer = document.getElementById('shelvesContainer');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');

// Initialize the bookshelf
function initBookshelf() {
    renderBookshelf(books);

    // Add event listeners
    searchInput.addEventListener('input', handleSearch);
    sortSelect.addEventListener('change', handleSort);
}

// Handle search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredBooks = books.filter(book =>
        book.name.toLowerCase().includes(searchTerm) ||
        book.category.toLowerCase().includes(searchTerm)
    );
    renderBookshelf(filteredBooks);
}

// Handle sorting functionality
function handleSort() {
    const sortValue = sortSelect.value;
    let sortedBooks = [...books];

    switch(sortValue) {
        case 'name':
            sortedBooks.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'size':
            sortedBooks.sort((a, b) => a.sizeMB - b.sizeMB);
            break;
        case 'category':
            sortedBooks.sort((a, b) => a.category.localeCompare(b.category));
            break;
    }

    // Apply search filter if there's a search term
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        sortedBooks = sortedBooks.filter(book =>
            book.name.toLowerCase().includes(searchTerm) ||
            book.category.toLowerCase().includes(searchTerm)
        );
    }

    renderBookshelf(sortedBooks);
}

// Render the bookshelf with given books
function renderBookshelf(bookList) {
    // Clear existing shelves
    shelvesContainer.innerHTML = '';

    // Show empty state if no books
    if (bookList.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }

    // Hide empty state
    emptyState.classList.add('hidden');

    // Organize books into shelves using the packing algorithm
    const shelves = organizeBooksIntoShelves(bookList);

    // Create shelf elements
    shelves.forEach((shelf, index) => {
        const shelfElement = createShelfElement(shelf, index + 1);
        shelvesContainer.appendChild(shelfElement);
    });
}

// Organize books into shelves based on the 30MB capacity rule
function organizeBooksIntoShelves(bookList) {
    const shelves = [];
    let currentShelf = [];
    let currentShelfUsed = 0;

    bookList.forEach(book => {
        // If adding this book would exceed shelf capacity, create a new shelf
        if (currentShelfUsed + book.sizeMB > SHELF_CAPACITY_MB && currentShelf.length > 0) {
            shelves.push(currentShelf);
            currentShelf = [];
            currentShelfUsed = 0;
        }

        // Add book to current shelf
        currentShelf.push(book);
        currentShelfUsed += book.sizeMB;
    });

    // Don't forget the last shelf if it has books
    if (currentShelf.length > 0) {
        shelves.push(currentShelf);
    }

    return shelves;
}

// Create a shelf element with books
function createShelfElement(books, shelfNumber) {
    const shelfElement = document.createElement('div');
    shelfElement.className = 'shelf';

    // Calculate shelf usage
    const totalSize = books.reduce((sum, book) => sum + book.sizeMB, 0);
    const usagePercentage = (totalSize / SHELF_CAPACITY_MB) * 100;

    // Shelf header
    const shelfHeader = document.createElement('div');
    shelfHeader.className = 'shelf-header';

    const shelfTitle = document.createElement('div');
    shelfTitle.className = 'shelf-title';
    shelfTitle.textContent = `📚 Shelf ${shelfNumber}`;

    const shelfUsage = document.createElement('div');
    shelfUsage.className = 'shelf-usage';
    shelfUsage.textContent = `${totalSize.toFixed(1)} / ${SHELF_CAPACITY_MB} MB`;

    shelfHeader.appendChild(shelfTitle);
    shelfHeader.appendChild(shelfUsage);

    // Books container
    const booksContainer = document.createElement('div');
    booksContainer.className = 'books-container';

    // Add books to the shelf
    books.forEach(book => {
        const bookElement = createBookElement(book);
        booksContainer.appendChild(bookElement);
    });

    // Progress bar
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.width = `${usagePercentage}%`;

    const progressText = document.createElement('div');
    progressText.className = 'progress-text';
    progressText.textContent = `${Math.round(usagePercentage)}% Full`;

    progressContainer.appendChild(progressBar);

    // Assemble shelf
    shelfElement.appendChild(shelfHeader);
    shelfElement.appendChild(booksContainer);
    shelfElement.appendChild(progressContainer);
    shelfElement.appendChild(progressText);

    return shelfElement;
}

// Create a book element
function createBookElement(book) {
    const bookElement = document.createElement('div');
    bookElement.className = 'book';

    // Calculate width based on size (1MB = 6px)
    const bookWidth = book.sizeMB * SCALE_PX_PER_MB;
    bookElement.style.width = `${bookWidth}px`;

    // Add category class for styling
    const categoryClass = `category-${book.category.toLowerCase().replace(/\s+/g, '-')}`;
    bookElement.classList.add(categoryClass);

    // Book spine (title rotated)
    const bookSpine = document.createElement('div');
    bookSpine.className = 'book-spine';
    bookSpine.textContent = book.name;

    // Book title (shown on hover)
    const bookTitle = document.createElement('div');
    bookTitle.className = 'book-title';
    bookTitle.textContent = book.name;

    // Book size (shown on hover)
    const bookSize = document.createElement('div');
    bookSize.className = 'book-size';
    bookSize.textContent = `${book.sizeMB} MB`;

    // Add click event to open book
    bookElement.addEventListener('click', () => {
        // Create a modal with book details
        showBookDetails(book);
    });

    bookElement.appendChild(bookSpine);
    bookElement.appendChild(bookTitle);
    bookElement.appendChild(bookSize);

    return bookElement;
}

// Show book details in a modal
function showBookDetails(book) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.book-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'book-modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => modal.remove());

    const title = document.createElement('h2');
    title.textContent = book.name;

    const category = document.createElement('p');
    category.innerHTML = `<strong>Category:</strong> ${book.category}`;

    const size = document.createElement('p');
    size.innerHTML = `<strong>Size:</strong> ${book.sizeMB} MB`;

    const path = document.createElement('p');
    path.innerHTML = `<strong>Path:</strong> ${book.path}`;

    const openBtn = document.createElement('button');
    openBtn.textContent = 'Open Book';
    openBtn.className = 'open-btn';
    openBtn.addEventListener('click', () => {
        alert(`Opening: ${book.name}\nThis would open the file at: ${book.path}`);
        // In a real implementation: window.open(book.path, '_blank');
    });

    modalContent.appendChild(closeBtn);
    modalContent.appendChild(title);
    modalContent.appendChild(category);
    modalContent.appendChild(size);
    modalContent.appendChild(path);
    modalContent.appendChild(openBtn);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initBookshelf);