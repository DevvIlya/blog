let currentPage = 1;
let pageSize = 10;
let totalPages = 1;

document.addEventListener('DOMContentLoaded', () => {
    const pageSizeSelect = document.getElementById('page-size');
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', (e) => {
            pageSize = parseInt(e.target.value);
            currentPage = 1;
            loadPosts();
        });
        pageSize = parseInt(pageSizeSelect.value);
    }
    loadPosts();
});

function loadPosts() {
    fetch(`/api/posts/?page=${currentPage}&page_size=${pageSize}`)
        .then(response => response.json())
        .then(data => {
            renderPosts(data.results);
            renderPagination(data.count);
        })
        .catch(error => console.error('Ошибка:', error));
}

function renderPosts(posts) {
    const postList = document.getElementById('post-list');
    postList.innerHTML = '';
    posts.forEach(post => {
        const div = document.createElement('div');
        div.classList.add('post-card');
        div.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <p><strong>Author:</strong> ${post.author} | <strong>Created at:</strong> ${new Date(post.created_at).toLocaleString()}</p>
            <a href="/post/${post.id}" class="btn btn-primary">View Post</a>
        `;
        postList.appendChild(div);
    });
}

function renderPagination(totalCount) {
    totalPages = Math.ceil(totalCount / pageSize);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    // Всегда показываем пагинацию, даже если одна страница
    const prev = createPageButton('«', currentPage - 1);
    const next = createPageButton('»', currentPage + 1);

    // Если только одна страница, делаем кнопки неактивными
    if (totalPages <= 1) {
        prev.disabled = true;
        next.disabled = true;
    } else {
        if (currentPage > 1) {
            prev.disabled = false;
        } else {
            prev.disabled = true;
        }

        if (currentPage < totalPages) {
            next.disabled = false;
        } else {
            next.disabled = true;
        }
    }

    pagination.appendChild(prev);

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // Номера страниц
    for (let i = startPage; i <= endPage; i++) {
        const btn = createPageButton(i, i);
        if (i === currentPage) btn.classList.add('btn-primary');
        pagination.appendChild(btn);
    }

    pagination.appendChild(next);
}

function createPageButton(text, page) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.classList.add('btn', 'btn-outline-primary', 'pagination-btn');
    btn.onclick = () => {
        if (btn.disabled) return; // Если кнопка неактивна, ничего не делаем
        currentPage = page;
        loadPosts();
    };
    return btn;
}

function createPageButton(text, page) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.classList.add('btn', 'btn-outline-primary', 'pagination-btn');
    btn.onclick = () => {
        currentPage = page;
        loadPosts();
    };
    return btn;
}
