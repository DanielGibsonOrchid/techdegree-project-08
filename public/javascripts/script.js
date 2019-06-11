// JavaScript for Pagination

const books = document.querySelectorAll('tbody tr');
const pages = Math.ceil(books.length / 5);
const paginationDiv = document.querySelector('.paginationDiv');
const paginationUl = document.createElement('ul');

// Function to show max of 5 books per page
function showBooks(books, page) {
  for (let i = 0; i < books.length; i++){
    let min = page * 5 - 5;
    let max = page * 5 - 1;
    if(i <= max && i >= min) {
      books[i].style.display = "";
    } else {
      books[i].style.display = "none";
    } 
  };
};

// paginationDiv.appendChild(paginationUl);

// Function to Append pagination links
function appendPagination(books) {
  const pagination = document.querySelector('.pagination ul')
  if (pagination) {
    pagination.remove('ul');
  };
  for(let i = 1; i <= pages; i++){
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'button';
    a.textContent = i + ' ';
    a.addEventListener('click', (e) => {
      showBooks(books, e.target.text);
    });
    li.appendChild(a);
    paginationUl.appendChild(li);
    paginationDiv.appendChild(paginationUl);
  }
}

appendPagination(books);
showBooks(books, 1);