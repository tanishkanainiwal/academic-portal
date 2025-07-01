// Welcome Page Transition
document.getElementById('startBtn').addEventListener('click', function () {
  const welcome = document.getElementById('welcomePage');
  welcome.style.transition = 'opacity 0.7s ease';
  welcome.style.opacity = 0;

  setTimeout(() => {
    welcome.style.display = 'none';
    document.getElementById('mainApp').classList.remove('d-none');
    document.querySelector('.bg-blur').style.display = 'none';
    window.scrollTo(0, 0);
  }, 700);
});

// Ingredient Data
const mainIngredients = ["Rice", "Potato", "Paneer", "Chicken", "Mutton", "Fish", "Egg", "Prawn", "Bhindi"];
const sideIngredients = ["Onion", "Tomato", "Garlic", "Ginger", "Green Chili", "Capsicum", "Carrot", "Beans"];
const masale = ["Salt", "Turmeric", "Cumin", "Garam Masala", "Red Chili Powder", "Coriander Powder"];
const snackIngredients = ["Flour", "Cheese", "Bread", "Butter", "Oil", "Potato", "Onion"];
const sweetIngredients = ["Sugar", "Khoya", "Paneer", "Milk", "Cardamom", "Water"];

// Recipes
const recipes = [
  {
    name: "Paneer Butter Masala",
    ingredients: ["Paneer", "Tomato", "Onion", "Butter", "Cream", "Garam Masala"],
    steps: [
      "Heat butter in a pan.",
      "Add chopped onions and sauté till golden.",
      "Add tomato puree and cook till oil separates.",
      "Add spices and cream, mix well.",
      "Add paneer cubes and cook for 5 mins."
    ],
    category: "veg"
  },
  {
    name: "Aloo Gobi",
    ingredients: ["Potato", "Cauliflower", "Onion", "Tomato", "Turmeric", "Cumin"],
    steps: [
      "Heat oil in a pan.",
      "Add cumin seeds and let them splutter.",
      "Add chopped onions and sauté.",
      "Add chopped tomatoes and cook till soft.",
      "Add turmeric and spices, mix well.",
      "Add potatoes and cauliflower, cook covered for 15 mins."
    ],
    category: "veg"
  },
  {
    name: "Butter Chicken",
    ingredients: ["Chicken", "Yogurt", "Tomato", "Butter", "Cream", "Garam Masala"],
    steps: [
      "Marinate chicken in yogurt and spices.",
      "Grill or fry chicken pieces.",
      "Prepare tomato gravy with butter and spices.",
      "Add grilled chicken and cream, simmer for 10 mins."
    ],
    category: "nonveg"
  },
  {
    name: "Pizza",
    ingredients: ["Flour", "Cheese", "Tomato", "Onion", "Capsicum"],
    steps: [
      "Make pizza dough from flour.",
      "Spread tomato sauce on the base.",
      "Add toppings: cheese, onion, capsicum.",
      "Bake in oven at 200°C for 15 mins."
    ],
    category: "snack"
  },
  {
    name: "Dal Makhni",
    ingredients: ["Urad Dal", "Rajma", "Onion", "Tomato", "Butter", "Cream"],
    steps: [
      "Soak dal and rajma overnight.",
      "Cook dal and rajma in pressure cooker.",
      "Sauté onions and tomatoes, add spices.",
      "Mix with cooked dal, add butter and cream.",
      "Simmer for 10 mins."
    ],
    category: "dal"
  },
  {
    name: "Gulab Jamun",
    ingredients: ["Khoya", "Flour", "Sugar", "Water", "Cardamom"],
    steps: [
      "Mix khoya, flour, and a little milk to make dough.",
      "Make small balls and fry till golden.",
      "Boil sugar and water, add cardamom.",
      "Soak fried balls in sugar syrup."
    ],
    category: "sweet"
  },
  {
    name: "Bhindi Masala",
    ingredients: ["Bhindi", "Onion", "Tomato", "Turmeric", "Cumin"],
    steps: [
      "Wash and cut bhindi.",
      "Sauté onions, add tomatoes and spices.",
      "Add bhindi, cook covered for 10 mins."
    ],
    category: "veg"
  }
];

// App State
let selectedIngredients = [];
let currentCategory = "all";
let suggestions = [];

// Render Ingredients
function renderIngredientLists(filter = "") {
  const ingredientLists = document.getElementById('ingredientLists');
  ingredientLists.innerHTML = "";

  function renderCategory(title, items) {
    const filtered = items.filter(item => item.toLowerCase().includes(filter.toLowerCase()));
    if (filtered.length === 0) return "";
    let html = `<div class="col-12 mb-2"><strong>${title}:</strong><br>`;
    filtered.forEach(item => {
      html += `<span class="ingredient-pill${selectedIngredients.includes(item) ? ' selected' : ''}" data-ingredient="${item}">${item}</span>`;
    });
    html += "</div>";
    return html;
  }

  ingredientLists.innerHTML += renderCategory("Main Ingredients", mainIngredients);
  ingredientLists.innerHTML += renderCategory("Side Ingredients", sideIngredients);
  ingredientLists.innerHTML += renderCategory("Masale/Spices", masale);
  ingredientLists.innerHTML += renderCategory("Snack Ingredients", snackIngredients);
  ingredientLists.innerHTML += renderCategory("Sweet Ingredients", sweetIngredients);

  document.querySelectorAll('.ingredient-pill').forEach(pill => {
    pill.onclick = function () {
      const ing = this.dataset.ingredient;
      if (selectedIngredients.includes(ing)) {
        selectedIngredients = selectedIngredients.filter(i => i !== ing);
      } else {
        selectedIngredients.push(ing);
      }
      renderIngredientLists(document.getElementById('ingredientSearch').value);
    };
  });
}

// Search Listener
document.getElementById('ingredientSearch').addEventListener('input', function () {
  renderIngredientLists(this.value);
});

// Toggle Ingredient Panel
document.getElementById('toggleIngredients').onclick = function () {
  document.getElementById('ingredientLists').classList.toggle('active');
};

// Category Filters
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.onclick = function () {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentCategory = this.dataset.category;
  };
});

// Recipe Finder
document.getElementById('findRecipes').onclick = function () {
  suggestions = recipes.filter(r =>
    (currentCategory === "all" || r.category === currentCategory) &&
    r.ingredients.some(ing => selectedIngredients.includes(ing))
  );

  const recipeSuggestions = document.getElementById('recipeSuggestions');
  recipeSuggestions.innerHTML = "";

  if (suggestions.length === 0) {
    recipeSuggestions.innerHTML = `<div class="alert alert-warning">No recipes found for selected ingredients.</div>`;
    return;
  }

  suggestions.forEach((rec, idx) => {
    const card = document.createElement('div');
    card.className = "card p-3";
    card.innerHTML = `
      <h5 class="mb-2">${rec.name}</h5>
      <div><strong>Ingredients:</strong> ${rec.ingredients.join(', ')}</div>
      <button class="btn btn-outline-secondary mt-2 showStepsBtn" data-idx="${idx}"><i class="fas fa-list"></i> Show Steps</button>
      <div class="recipe-steps d-none"></div>
    `;
    recipeSuggestions.appendChild(card);
  });

  document.querySelectorAll('.showStepsBtn').forEach(btn => {
    btn.onclick = function () {
      const idx = this.dataset.idx;
      const card = this.closest('.card');
      showRecipeSteps(suggestions[idx], card);
    };
  });
};

// Show Recipe Steps
function showRecipeSteps(recipe, card) {
  let stepsDiv = card.querySelector('.recipe-steps');
  if (!stepsDiv) {
    stepsDiv = document.createElement('div');
    stepsDiv.className = 'recipe-steps';
    card.appendChild(stepsDiv);
  }
  let html = `<h6 class="mb-2">Steps:</h6><ol>`;
  recipe.steps.forEach((step, i) => {
    html += `<li>${step}</li>`;
  });
  html += `</ol>`;
  stepsDiv.innerHTML = html;
  stepsDiv.classList.toggle('d-none');

  let voiceBtn = card.querySelector('.voice-btn');
  if (!voiceBtn) {
    voiceBtn = document.createElement('button');
    voiceBtn.className = 'btn btn-sm btn-success mt-2 voice-btn';
    voiceBtn.innerHTML = '<i class="fas fa-volume-up"></i> Read Steps';
    stepsDiv.appendChild(voiceBtn);
    voiceBtn.onclick = function () {
      readSteps(recipe.steps);
    };
  }
}

// Voice Reader
function readSteps(steps) {
  if (!('speechSynthesis' in window)) {
    alert("Sorry, your browser doesn't support speech synthesis.");
    return;
  }
  window.speechSynthesis.cancel();
  let idx = 0;

  function speakStep() {
    if (idx >= steps.length) return;
    const utter = new SpeechSynthesisUtterance(`Step ${idx + 1}: ${steps[idx]}`);
    utter.onend = function () {
      idx++;
      if (idx < steps.length) speakStep();
    };
    window.speechSynthesis.speak(utter);
  }

  speakStep();
}

// Initial Ingredient Render
renderIngredientLists();
