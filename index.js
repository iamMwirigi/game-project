document.addEventListener("DOMContentLoaded",()=>{
    const amiiboContainer = document.getElementById("amiibo-container");
    const searchInput = document.getElementById("search-input");
    const filterSelect = document.getElementById("filter-select");

    //Fetch data from API
    fetch("https://www.amiiboapi.com/api/amiibo/?")
        .then(response => response.json())
        .then(data => {
            //Data for characters
            const amiiboData = data;

            //Function to render comments
            function renderComments(parent , comments) {
                parent.innerHTML = "";
                comments.forEach(commentText => {
                    const comment = document.createElement("p");
                    comment.textContent = commentText;
                    parent.appendChild(comment);
                });
            }

            //Function to render cards
            function renderAmiibo(amiibo) {
                const amiiboCard = document.createElement("div");
                amiiboCard.classList.add("amiibo-card");

                const amiiboImage = document.createElement("img");
                amiiboImage.src = amiibo.image;

                const likeButton = document.createElement("button");
                likeButton.textContent = `Like`;
                likeButton.classList.add("like-button");
                likeButton.addEventListener("click", () => {
                    amiibo.liked = !amiibo.liked;
                    likeButton.textContent = `Liked`;
                    likeButton.classList.toggle("liked");
                });

                const commentInput = document.createElement("input");
                commentInput.type = "text";
                commentInput.placeholder = "Add a comment";

                const commentButton = document.createElement("button");
                commentButton.textContent = "Add Comment";
                commentButton.addEventListener("click", () => {
                    const commentText = commentInput.value;
                    if (commentText) {
                        amiibo.comments.push(commentText);
                        renderComments(comments , amiibo.comments);
                        commentInput.value = "";
                    }
                });

                const characterName = document.createElement("h2");
                characterName.textContent = amiibo.name;

                const series = document.createElement("p");
                series.textContent = `Series : ${amiibo.gameSeries}`;

                const comments = document.createElement("div");
                comments.classList.add("comments");

                amiiboCard.appendChild(characterName);
                amiiboCard.appendChild(series);
                amiiboCard.appendChild(amiiboImage);
                amiiboCard.appendChild(likeButton);
                amiiboCard.appendChild(commentInput);
                amiiboCard.appendChild(commentButton);
                amiiboCard.appendChild(comments);

                amiiboContainer.appendChild(amiiboCard);
            }

            //Function to filter cards
            function filterAmiibo() {
                const filterValue = filterSelect.value;
                const searchValue = searchInput.value.toLowerCase();

                amiiboContainer.innerHTML = "";

                amiiboData.amiibo.forEach(amiibo => {
                    if (
                        (filterValue === "all" || (filterValue === "liked" && amiibo.liked)) &&
                        (amiibo.name.toLowerCase().includes(searchValue) || searchValue === "")
                    ) {
                        renderAmiibo(amiibo);
                    }
                });
                
            }

            //Initial rendering
            filterAmiibo();

            //Event listeners for search and filter
            searchInput.addEventListener("input" , filterAmiibo);
            filterSelect.addEventListener("change" , filterAmiibo);
        })
    .catch(error => console.error("Error fetching data:" , error));   
})