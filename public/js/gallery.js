document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.querySelector('.recipe-gallery');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.querySelector('#recipe-search');
    
    // Masonry layout initialization
    const masonryLayout = new Masonry(gallery, {
        itemSelector: '.recipe-card',
        columnWidth: '.recipe-card',
        percentPosition: true,
        gutter: 20
    });

    // Lazy loading for images
    const lazyLoadImages = () => {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img.lazy').forEach(img => {
            imageObserver.observe(img);
        });
    };

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const recipes = document.querySelectorAll('.recipe-card');
            recipes.forEach(recipe => {
                const category = recipe.dataset.category;
                if (filter === 'all' || category === filter) {
                    recipe.style.display = 'block';
                } else {
                    recipe.style.display = 'none';
                }
            });
            masonryLayout.layout();
        });
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const recipes = document.querySelectorAll('.recipe-card');
        
        recipes.forEach(recipe => {
            const title = recipe.querySelector('.recipe-title').textContent.toLowerCase();
            const description = recipe.querySelector('.recipe-description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                recipe.style.display = 'block';
            } else {
                recipe.style.display = 'none';
            }
        });
        masonryLayout.layout();
    });

    // Recipe card hover effects
    const recipeCards = document.querySelectorAll('.recipe-card');
    recipeCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hover');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hover');
        });
    });

    // Initialize lazy loading
    lazyLoadImages();
});
