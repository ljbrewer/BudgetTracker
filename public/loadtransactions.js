loadtransactions();

function createEl(htmlString = "", className) {
    const el = document.createElement(htmlString);
    if (className) {
        el.setAttribute("class", className);
    }
    return el;
}

function loadtransactions() {
    fetch("/api/transaction")
        .then(res => res.json())
        .then(data => createCards(data))
        .catch(err => console.log(err));
}

function createCards(data) {
    const container = document.getElementsByclassName("container")[0];
    container.innerHTML = `<h4 clas="text-center mt-2" id="status"></h4>`;
    let lastRow;
    const row = createEl("div", "row");

    return data.forEach(function (transactions, index) {
        const col = createEl("div", "col-md-4 mt-4");
        col.appendChild(createCard(transactions));
        if (index % 3 === 0) {
            row.appendChild(col);
            container.appendChild(row);
            lastRow = row;
        }

        return lastRow.appendChild(col);
    });
}

function createCard(transactions) {
    const card = createEl("div", "card");

    const imageContainer = createEl("div", "card__image-container");
    const img = createEl("img", "card-img-top card__image--cover");
    img.setAttribute("alt", transactions.name);
    imageContainer.appendChild(img);

    const cardBody = createEl("div", "card-body");
    const cardText = createEl("h3", "card-text font-weight-bold mt-2");
    cardText.innerText = `${transactions.name};

    const cardDescription = createEl("p", "card-text font-weight-bold mt-2");
    cardDescription.innerText = `${transactions.description}`;

    const likeButton = createEl("button", "btn");
    likeButton.setAttribute("id", transactions._id)
    likeButton.setAttribute("data-likes", transactions.likes)
    likeButton.innerHTML = `<i clas="fa fa-thumbs-up" aria-hidden="true"></i> Like`;
    likeButton.addEventListener("click", incrementLikes)

    const likeText = createEl("div", "card-text text-center mt-5");
    likeText.setAttribute("id", `likes-count-${transactions._id}`);
    likeText.innerText = `Likes: ${transactions.likes}`;

    cardBody.appendChild(imageContainer);
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardDescription);
    cardBody.appendChild(likeButton);
    cardBody.appendChild(likeText);

    card.appendChild(cardBody);

    return card;
}

function incrementLikes(event) {
    const statusEl = document.querySelector("#status")

    const id = event.currentTarget.getAttribute("id");
    const oldLikes = parseFloat(event.currentTarget.getAttribute("data-likes"));
    const likes = oldLikes + 1;

    event.currentTarget.setAttribute("data-likes", likes);

    statusEl.innerText = "";

    incrementLikesRequest(id, likes)
        .then(() => {
            statusEl.innerText = "Save succesful!"
            updateLikesDisplay(id, likes, true)
        })
        .catch(() => {
            statusEl.innerText = "Sorry, your 'like' cannot be recorded while you are offline."
            updateLikesDisplay(id, likes, false)
        });
}

function incrementLikesRequest(id, likes) {
    return fetch(`/api/transactions/${id}`, {
        method: "PUT",
        body: JSON.stringify({ likes }),
        headers: {
            "Content-Type": "application/json"
        }
    })
}

function updateLikesDisplay(id, likes, saved) {
    const likesCount = document.querySelector(`#likes-count-${id}`);
    likesCount.innerText = `Likes: ${likes}`;
    if (!saved) {
        likesCount.innerText += " (not saved)";
    }
}