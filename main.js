let books = [];

// Fungsi yang dijalankan saat halaman dimuat
window.onload = () => {
  // Memeriksa apakah ada data buku di local storage
  if (localStorage.getItem('books')) {
    // Mengambil data buku dari local storage dan mengubahnya dari JSON ke objek JavaScript
    books = JSON.parse(localStorage.getItem('books'));
    // Menampilkan buku di halaman
    renderBooks();
  }
};

// Menangani pengiriman formulir
document.getElementById('bookForm').addEventListener('submit', function (event) {
  event.preventDefault();
  
  // Mengambil nilai dari input formulir dan memangkas spasi yang tidak diperlukan
  const title = document.getElementById('bookFormTitle').value.trim();
  const author = document.getElementById('bookFormAuthor').value.trim();
  const year = parseInt(document.getElementById('bookFormYear').value, 10);
  const genre = document.getElementById('bookFormGenre').value;
  const isComplete = document.getElementById('bookFormIsComplete').checked;
  
  // Memeriksa apakah judul buku sudah ada
  if (isTitleDuplicate(title)) {
    alert('Buku dengan judul ini sudah ada!');
    return;
  }
  
  // Membuat ID unik untuk buku baru
  const bookId = Date.now().toString();
  // Membuat objek buku baru
  const newBook = { id: bookId, title, author, year, genre, isComplete };
  
  // Menambahkan buku baru ke daftar buku
  books.push(newBook);
  // Menyimpan daftar buku ke local storage
  saveToLocalStorage();
  // Menampilkan buku di halaman
  renderBooks();
  
  // Mengatur ulang formulir setelah buku ditambahkan
  this.reset();
});

// Menyimpan daftar buku ke local storage
function saveToLocalStorage() {
  localStorage.setItem('books', JSON.stringify(books));
}

// Memeriksa apakah judul buku sudah ada di daftar buku
function isTitleDuplicate(title) {
  return books.some(book => book.title.toLowerCase() === title.toLowerCase());
}

// Menampilkan buku berdasarkan kriteria pencarian
function renderBooks() {
  // Mengambil nilai pencarian dari input pencarian
  const searchText = document.getElementById('searchBookFormTitleInput').value.toLowerCase();
  const searchYear = parseInt(document.getElementById('searchYearInput').value, 10);
  const searchGenre = document.getElementById('searchGenreInput').value;
  
  // Mengambil elemen daftar buku yang belum selesai dan sudah selesai dibaca
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');
  
  // Mengosongkan daftar buku yang belum selesai dan sudah selesai dibaca
  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';
  
  // Menyaring buku berdasarkan kriteria pencarian dan menampilkannya
  books
    .filter(book => 
      (book.title.toLowerCase().includes(searchText) || book.author.toLowerCase().includes(searchText)) &&
      (isNaN(searchYear) || book.year === searchYear) &&
      (searchGenre === '' || book.genre === searchGenre)
    )
    .forEach(book => {
      // Membuat elemen buku baru
      const bookElement = document.createElement('div');
      bookElement.setAttribute('data-bookid', book.id);
      bookElement.setAttribute('data-testid', 'bookItem');
      bookElement.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <p data-testid="bookItemGenre">Genre: ${book.genre}</p>
        <div>
          <button data-testid="bookItemIsCompleteButton">${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}</button>
          <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        </div>
      `;
      
      // Menambahkan event listener untuk tombol "Selesai dibaca/Belum selesai dibaca"
      const toggleButton = bookElement.querySelector('[data-testid="bookItemIsCompleteButton"]');
      const deleteButton = bookElement.querySelector('[data-testid="bookItemDeleteButton"]');
      
      toggleButton.addEventListener('click', () => {
        // Mengubah status selesai dibaca dan menyimpan perubahan
        book.isComplete = !book.isComplete;
        saveToLocalStorage();
        renderBooks();
      });
      
      // Menambahkan event listener untuk tombol "Hapus Buku"
      deleteButton.addEventListener('click', () => {
        // Menghapus buku dari daftar dan menyimpan perubahan
        books = books.filter(b => b.id !== book.id);
        saveToLocalStorage();
        renderBooks();
      });
      
      // Menambahkan elemen buku ke daftar yang sesuai (belum selesai atau sudah selesai dibaca)
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
}

// Menambahkan fungsionalitas pencarian dengan mendengarkan klik tombol "Search"
document.querySelector('[data-testid="searchBookForm"]').addEventListener('submit', event => {
  event.preventDefault();
  renderBooks();
});
