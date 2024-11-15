const input = document.querySelector(".form-control");
const btn = document.querySelector(".btn");
const todoContainer = document.querySelector(".list-group");

const audio = new Audio("../sound/au-revoir.mp3");

btn.addEventListener("click", (e) => addToDo(e));
document.addEventListener("DOMContentLoaded", generateHTML);
todoContainer.addEventListener("click", (e) => deleteTodo(e));

// Désactiver le bouton au chargement de la page si l'input est vide
btn.disabled = true;

// Désactiver/activer le bouton en fonction du texte dans l'input (en dehors de la fonction addToDo)
input.addEventListener("input", () => {
    if (input.value.trim() === "") {
        btn.disabled = true; // Désactiver si vide
    } else {
        btn.disabled = false; // Activer si non vide
    }
});

function addToDo(e) {
    e.preventDefault();
    if (input.value === "") {
        alert("You must write something!");
    } else {
        saveToLocalStorage(input.value);
        generateHTML();
        //On réinitialise l'input et on désactive le bouton ajouter
        input.value = "";
    }
}

function deleteTodo(e) {
    const item = e.target;
    console.log(item.closest(".todo").getAttribute("data-id"));
    if (item.classList.contains("delete-btn") || item.closest(".delete-btn")) {
        audio.play();
        // Ajoute la classe fade-out pour lancer l'animation
        item.closest(".todo").classList.add("fade-out");

        // Utilise setTimeout pour supprimer l'élément après l'animation
        setTimeout(() => {
            // Supprime l'élément .todo le plus proche
            removeFromLocalStorage(
                item.closest(".todo").getAttribute("data-id")
            );
            item.closest(".todo").remove();
        }, 700); // Temps correspondant à la durée de l'animation

        /*
        // Supprime l'élément .todo le plus proche
        removeFromLocalStorage(item.closest(".todo").getAttribute("data-id"));
        item.closest(".todo").remove();*/
    }

    if (item.classList.contains("check-btn") || item.closest(".check-btn")) {
        // Toggle la classe .checked sur l'élément .todo le plus proche
        updateTodoStatusInLocalStorage(
            item.closest(".todo").getAttribute("data-id")
        );
        item.closest(".todo").classList.toggle("checked");
    }
}

function saveToLocalStorage(value) {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    const todo = { id: generateId(), todo: value, isCheck: false };
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function removeFromLocalStorage(todoId) {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    const newTodos = todos.filter((todo) => {
        return todo.id !== todoId;
    });

    localStorage.setItem("todos", JSON.stringify(newTodos));
}

function generateId() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

function generateHTML() {
    // Vider le conteneur avant de regénérer les tâches
    const todoContainer = document.querySelector(".list-group"); // Cible la liste des tâches
    todoContainer.innerHTML = ""; // Vide le conteneur avant d'ajouter les nouveaux éléments

    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    todos.forEach((todo) => {
        const newTodo = document.createElement("li");
        newTodo.setAttribute("data-id", todo.id);
        newTodo.classList.add("todo");

        if (todo.isCheck === true) {
            newTodo.classList.add("checked");
        }

        // Créer le conteneur des boutons
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");

        // le bouton check
        const checkBtn = document.createElement("button");
        checkBtn.classList.add("check-btn");

        // le bouton trash
        const trashBtn = document.createElement("button");
        trashBtn.classList.add("delete-btn");

        // On ajoute les images des boutons
        const checkImg = document.createElement("img");
        checkImg.setAttribute("src", "../images/check.png");
        const trashImg = document.createElement("img");
        trashImg.setAttribute("src", "../images/trash.png");

        // On désactive les évenements sur les images
        trashImg.style.pointerEvents = "none";
        checkImg.style.pointerEvents = "none";

        trashImg.style.height = "30px";
        checkImg.style.height = "30px";

        //On ajoute du texte de la tâche
        //newTodo.innerText = input.value;
        const todoText = document.createElement("span");
        todoText.innerText = todo.todo;
        // On ajoute des images aux boutons
        checkBtn.appendChild(checkImg);
        trashBtn.appendChild(trashImg);

        // On ajoute des boutons au conteneur des boutons trash et check
        buttonContainer.appendChild(checkBtn);
        buttonContainer.appendChild(trashBtn);

        // On ajoute le conteneur des boutons à la balise li

        todoContainer.appendChild(newTodo);

        // On ajoute le texte et les boutons trash et check dans li
        newTodo.appendChild(todoText);
        newTodo.appendChild(buttonContainer);

        return newTodo;
    });
}

// Fonction pour mettre à jour le statut d’une ToDo dans LocalStorage
function updateTodoStatusInLocalStorage(todoId) {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.forEach((todo) => {
        if (todo.id === todoId) {
            todo.isCheck = !todo.isCheck; // Inverser le statut (toggle)
        }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Filtrer les taches avec les boutons toutes, à faire et faites

// On sélectionne tous les boutons de filtre
const filterButtons = document.querySelectorAll(".btn-group .btn");
// On sélectionne tous les boutons dans le groupe de boutons, c'est-à-dire les boutons "Toutes", "À faire", et "Faites".

// On ajoute un événement click à chaque bouton
filterButtons.forEach((button) => {
    button.addEventListener("click", filterTodos);
});
// Pour chaque bouton de filtre, on ajoute un événement "click" qui va appeler la fonction `filterTodos` lorsque le bouton est cliqué.

function filterTodos(e) {
    const todos = document.querySelectorAll(".todo");
    // On récupère toutes les tâches (les éléments <li> avec la classe "todo").

    const filter = e.target.getAttribute("data-filter");
    // On récupère la valeur de l'attribut `data-filter` du bouton cliqué. Cela peut être "all", "todo", ou "done".

    todos.forEach((todo) => {
        // Pour chaque tâche (chaque élément <li>), on applique une logique de filtrage en fonction de la valeur du filtre :
        switch (filter) {
            case "all":
                todo.style.display = "flex";
                // Si le filtre est "all", on affiche toutes les tâches (celles qui sont cochées et celles qui ne le sont pas).
                break;

            case "todo":
                if (!todo.classList.contains("checked")) {
                    todo.style.display = "flex";
                    // Si le filtre est "todo" (à faire) et que la tâche n'a pas la classe "checked" (c'est-à-dire qu'elle n'est pas encore faite), on l'affiche.
                } else {
                    todo.style.display = "none";
                    // Si la tâche est cochée (class "checked"), on la masque car elle est déjà faite.
                }
                break;

            case "done":
                if (todo.classList.contains("checked")) {
                    todo.style.display = "flex";
                    // Si le filtre est "done" (faites) et que la tâche a la classe "checked", on l'affiche car elle est marquée comme faite.
                } else {
                    todo.style.display = "none";
                    // Si la tâche n'est pas cochée (pas faite), on la masque.
                }
                break;
        }
    });
}
