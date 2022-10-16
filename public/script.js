// const url = `https://ek-blog.herokuapp.com/graphql`;

const url = `/graphql`

const fetchArticles = async() => {

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `
                  query {
                        getAllArticles (
                        input: { page: 1 limit: 20, sortField: "id", sortOrder: "ASC"}) {
                        items {
                                id title content createdAt updatedAt
                        }
                        meta {
                            totalItems
                            itemCount
                            itemsPerPage
                            totalPages
                            currentPage
                        }
                      }
                    }
    `
        })
    });

    const data = await response.json();
    const articles = await data.data.getAllArticles.items;


    for (let i = 0; i < articles.length; i++) {
        const wrapper = document.getElementById('root');

        const card = document.createElement('div');
        card.setAttribute('class', 'card avatar-container center max-width');

        const articleDate = document.createElement('p');
        articleDate.setAttribute('class', 'gray text-align-right font-italic');
        const date = new Date(articles[i].createdAt).toLocaleDateString()
        articleDate.innerText = `Published: ${date}`;

        const articleTitle = document.createElement('h3');
        articleTitle.setAttribute('class', 'darkgray');
        articleTitle.innerText = articles[i].title;

        const articleContent = document.createElement('span');
        articleContent.setAttribute('class', 'darkgray');
        articleContent.innerText = articles[i].content;

        card.appendChild(articleDate);
        card.appendChild(articleTitle);
        card.appendChild(articleContent);
        wrapper.appendChild(card);
    }
}

fetchArticles();
