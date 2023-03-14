const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// show modal, focus on input
function showModal() {
  modal.classList.add('show-modal');
  websiteNameEl.focus();
}

// modal even listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));

window.addEventListener('click', (e) => (
  e.target === modal ? modal.classList.remove('show-modal') : false
))

// validate form
function validate(nameValue, urlValue) {
  const expression = /(https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert('Please submit values for both fields.');
    return false;
  }
  if (!urlValue.match(regex)) {
    alert('Please provide a valid web address.');
    return false;
  }
  // valid
  return true;
}

// build bookmarks DOM
function buildBookmarks() {
  bookmarks.forEach((bookmark, ind) => {
    const { name, url } = bookmark;

    const item = document.createElement('div');
    item.classList.add('item');

    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fas', 'fa-items');
    closeIcon.setAttribute('title', 'Delete Bookmark');
    closeIcon.setAttribute('onclick', `deleteBookmark(${url})`);

    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name');

    const favicon = document.createElement('img');
    favicon.setAttribute('src', ``);
    favicon.setAttribute('alt', 'Favicon');

    const link = document.createElement('a');
    link.setAttribute('href', `${url}`);
    link.setAttribute('target', '_blank');
    link.textContent = name;

    linkInfo.append(favicon, link);
    item.append(closeIcon, link);

    bookmarksContainer.appendChild(item);
  });
}

// fetch from local storage
function fetchBookmarks() {
  if (localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'))
  } else {
    bookmarks = [
      {
        name: 'Modern Design',
        url: 'https://modern.design'
      },
    ];
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }

  buildBookmarks();
}

// handle data from form
function storeBookmark(e) {
  e.preventDefault();  
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  if (!urlValue.includes('http://', 'https://')) {
    urlValue = `https://${urlValue}`
  }
  
  if(!validate(nameValue, urlValue)) {
    return false
  }

  const bookmark = {
    name: nameValue,
    url: urlValue,
  };

  bookmarks.push(bookmark);  
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
}

// event listener
bookmarkForm.addEventListener('submit', storeBookmark)

// on load get data from local storage
fetchBookmarks();