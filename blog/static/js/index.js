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

    const themeToggle = document.getElementById("themeToggle");
    const root = document.documentElement;

    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
        root.classList.add("dark");
    } else if (currentTheme === "light") {
        root.classList.remove("dark");
    } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) root.classList.add("dark");
    }

    themeToggle?.addEventListener("click", () => {
        const isDark = root.classList.toggle("dark");
        const theme = isDark ? "dark" : "light";
        localStorage.setItem("theme", theme);
    });

    loadPosts(); // <--- эта строчка была вне тела функции из-за отсутствия закрывающей скобки
}); // ← Вот эту скобку ты забыл

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
        div.className = `
            bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800
            transition hover:shadow-xl flex flex-col justify-between h-full
        `;
        div.innerHTML = `
            <div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">${post.title}</h3>
              <p class="text-gray-700 dark:text-gray-300 mb-4 line-clamp-4">${post.content}</p>
            </div>
            <div class="mt-auto">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <strong>Author:</strong> ${post.author} <br>
                <strong>Created:</strong> ${new Date(post.created_at).toLocaleString()}
              </p>
              <a href="/post/${post.id}" class="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
                View Post
              </a>
            </div>
        `;
        postList.appendChild(div);
    });
}

function renderPagination(totalCount) {
    totalPages = Math.ceil(totalCount / pageSize);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (totalPages > 1) {
        const prev = createPageButton('«', currentPage - 1);
        const next = createPageButton('»', currentPage + 1);

        prev.disabled = currentPage === 1;
        next.disabled = currentPage === totalPages;

        pagination.appendChild(prev);

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            const btn = createPageButton(i, i);
            if (i === currentPage) btn.classList.add('bg-blue-600', 'text-white');
            pagination.appendChild(btn);
        }

        pagination.appendChild(next);
    }
}

function createPageButton(text, page) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.className = 'px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all';
    btn.onclick = () => {
        if (btn.disabled) return;
        currentPage = page;
        loadPosts();
    };
    return btn;
}
