let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Technology" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Life" },
    { text: "The mind is everything. What you think you become.", category: "Philosophy" }
];
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';
const SYNC_INTERVAL_MS = 10000;
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const addQuoteButton = document.getElementById('addQuoteBtn');
const exportQuotesButton = document.getElementById('exportQuotesBtn');
const importFileInput = document.getElementById('importFile');
const categoryFilter = document.getElementById('categoryFilter'); 

function saveQuotes() {
    try {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    } catch (e) {
        console.error("Error saving quotes to local storage:", e);
        displayMessage("Error saving data. Storage might be full.", "error");
    }
}

function loadQuotes() {
    try {
        const storedQuotes = localStorage.getItem('quotes');
        if (storedQuotes) {
            quotes = JSON.parse(storedQuotes);
        }
    } catch (e) {
        console.error("Error loading quotes from local storage:", e);
        displayMessage("Error loading saved quotes. Data might be corrupted.", "error");
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
            { text: "Innovation distinguishes between a leader and a follower.", category: "Technology" },
            { text: "Strive not to be a success, but rather to be of value.", category: "Life" },
            { text: "The mind is everything. What you think you become.", category: "Philosophy" }
        ];
    }
}

function saveLastViewedQuote(quote) {
    try {
        sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
    } catch (e) {
        console.error("Error saving last viewed quote to session storage:", e);
    }
}

function loadLastViewedQuote() {
    try {
        const storedLastQuote = sessionStorage.getItem('lastViewedQuote');
        return storedLastQuote ? JSON.parse(storedLastQuote) : null;
    } catch (e) {
        console.error("Error loading last viewed quote from session storage:", e);
        return null;
    }
}

function saveSelectedCategory(category) {
    try {
        localStorage.setItem('selectedCategory', category);
    } catch (e) {
        console.error("Error saving selected category to local storage:", e);
    }
}

function loadSelectedCategory() {
    try {
        return localStorage.getItem('selectedCategory');
    } catch (e) {
        console.error("Error loading selected category from local storage:", e);
        return null;
    }
}

function showRandomQuote(filteredQuotes = quotes) {
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = `<p>"No quotes available for this category. Try another filter or add new quotes!"</p><footer>- App</footer>`;
        saveLastViewedQuote({ text: "No quotes available for this category.", category: "App" });
        return;
    }
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    const quoteParagraph = document.createElement('p');
    quoteParagraph.textContent = `"${randomQuote.text}"`;
    const quoteFooter = document.createElement('footer');
    quoteFooter.textContent = `- ${randomQuote.category}`;
    quoteDisplay.innerHTML = '';
    quoteDisplay.appendChild(quoteParagraph);
    quoteDisplay.appendChild(quoteFooter);
    saveLastViewedQuote(randomQuote);
}
function populateCategories() {
    const categories = ['all', ...new Set(quotes.map(quote => quote.category))].sort(); 
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
        if (category !== 'all') { 
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        }
    });

    const lastSelectedCategory = loadSelectedCategory();
    if (lastSelectedCategory && Array.from(categoryFilter.options).some(option => option.value === lastSelectedCategory)) {
        categoryFilter.value = lastSelectedCategory;
    } else {
        categoryFilter.value = 'all'; 
    }
}

function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    saveSelectedCategory(selectedCategory); 

    let filteredQuotes = [];
    if (selectedCategory === 'all') {
        filteredQuotes = quotes;
    } else {
        filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }
    showRandomQuote(filteredQuotes);
}

async function addQuote() {
    const newQuoteTextInput = document.getElementById('newQuoteText');
    const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
    const text = newQuoteTextInput.value.trim();
    const category = newQuoteCategoryInput.value.trim();
    if (text && category) {
        const newQuote = { text, category };
        quotes.push(newQuote); 
        saveQuotes(); 
        newQuoteTextInput.value = '';
        newQuoteCategoryInput.value = '';
        populateCategories(); 
        const currentSelectedCategory = categoryFilter.value;
        if (currentSelectedCategory === 'all' || currentSelectedCategory === category) {
            categoryFilter.value = category;
            saveSelectedCategory(category);
            quoteDisplay.innerHTML = `<p>"${text}"</p><footer>- ${category}</footer>`;
            saveLastViewedQuote(newQuote);
        } else {
            filterQuotes(); 
        }

        displayMessage("New quote added successfully! Attempting to sync with server...", "success"); 
        await postQuoteToServer(newQuote); 
    } else {
        displayMessage("Please enter both a quote and a category.", "error"); 
    }
}
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2); 
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json'; 
    document.body.appendChild(a); 
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    displayMessage("Quotes exported successfully!"); 
}
function importFromJsonFile(event) {
    const file = event.target.files[0]; 
    if (!file) {
        displayMessage("No file selected.", "error");
        return;
    }
    const fileReader = new FileReader(); 
    fileReader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            const isValid = Array.isArray(importedQuotes) && importedQuotes.every(
                q => typeof q === 'object' && q !== null && typeof q.text === 'string' && typeof q.category === 'string'
            );
            if (isValid) {
                const currentQuoteTexts = new Set(quotes.map(q => q.text));
                const newUniqueQuotes = importedQuotes.filter(iq => !currentQuoteTexts.has(iq.text));
                quotes.push(...newUniqueQuotes); 
                saveQuotes(); 
                populateCategories();
                displayMessage('Quotes imported successfully!'); 
                filterQuotes(); 
            } else {
                displayMessage("Invalid JSON format. Please ensure it's an array of quote objects with 'text' and 'category' properties.", "error");
            }
        } catch (error) {
            console.error("Error parsing JSON:", error);
            displayMessage("Failed to parse JSON file. Please ensure it's a valid JSON.", "error");
        }
    };
    fileReader.onerror = function() {
        console.error("Error reading file:", fileReader.error);
        displayMessage("Error reading file. Please try again.", "error");
    };
    fileReader.readAsText(file); 
    event.target.value = ''; 
}
function displayMessage(message, type = "success") {
    let msgDiv = document.getElementById('appMessage'); 
    if (!msgDiv) {
        msgDiv = document.createElement('div');
        msgDiv.id = 'appMessage';
        document.body.appendChild(msgDiv);
        Object.assign(msgDiv.style, {
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 25px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: 'bold',
            zIndex: '1000',
            transition: 'opacity 0.5s ease-in-out',
            opacity: '0', 
            textAlign: 'center',
            minWidth: '200px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        });
    }

    if (type === "success") {
        msgDiv.style.backgroundColor = '#4CAF50'; 
    } else if (type === "error") {
        msgDiv.style.backgroundColor = '#F44336'; 
    } else {
        msgDiv.style.backgroundColor = '#333'; 
    }

    msgDiv.textContent = message; 
    msgDiv.style.opacity = '1'; 
    setTimeout(() => {
        msgDiv.style.opacity = '0';
    }, 3000);
}
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(SERVER_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const serverData = await response.json();
        return serverData.slice(0, 10).map(item => ({ 
            text: item.title,
            category: 'Server Quote' 
        }));
    } catch (error) {
        console.error("Could not fetch quotes from server:", error);
        displayMessage("Failed to fetch quotes from server.", "error");
        return []; 
    }
}
async function postQuoteToServer(quote) {
    try {
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            body: JSON.stringify({
                title: quote.text,
                body: quote.category, 
                userId: 1, 
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log("Quote posted to server successfully:", responseData);
        displayMessage("Quote synced to server!");
    } catch (error) {
        console.error("Could not post quote to server:", error);
        displayMessage("Failed to sync quote to server.", "error");
    }
}


async function syncQuotes() {
    displayMessage("Syncing with server...", "success");
    const serverQuotes = await fetchQuotesFromServer();
    
    let localQuotesUpdated = false;
    let conflictsResolved = 0;
    let newQuotesAdded = 0;
    const currentLocalQuoteTexts = new Set(quotes.map(q => q.text));
    serverQuotes.forEach(serverQuote => {
        if (!currentLocalQuoteTexts.has(serverQuote.text)) {
            quotes.push(serverQuote);
            newQuotesAdded++;
            localQuotesUpdated = true;
        } else {
            const localQuote = quotes.find(q => q.text === serverQuote.text);
            if (localQuote && localQuote.category !== serverQuote.category) {
                localQuote.category = serverQuote.category;
                conflictsResolved++;
                localQuotesUpdated = true;
            }
        }
    });
    
    if (newQuotesAdded > 0 || conflictsResolved > 0) {
        saveQuotes(); 
        populateCategories();
        let syncMessage = `Sync complete: ${newQuotesAdded} new quotes added`;
        if (conflictsResolved > 0) {
            syncMessage += `, ${conflictsResolved} conflicts resolved (server precedence).`;
        } else {
            syncMessage += ".";
        }
        displayMessage(syncMessage, "success");
    } else {
        displayMessage("Sync complete: No new quotes from server or conflicts detected.", "success");
    }

    filterQuotes();
}

newQuoteButton.addEventListener('click', () => filterQuotes()); 
addQuoteButton.addEventListener('click', addQuote);
exportQuotesButton.addEventListener('click', exportToJsonFile);
importFileInput.addEventListener('change', importFromJsonFile);
categoryFilter.addEventListener('change', filterQuotes);
window.onload = function() {
    loadQuotes(); 
    populateCategories(); 
    const lastSelectedCategory = loadSelectedCategory();
    if (lastSelectedCategory && Array.from(categoryFilter.options).some(option => option.value === lastSelectedCategory)) {
        categoryFilter.value = lastSelectedCategory;
    } else {
        categoryFilter.value = 'all'; 
    }
    filterQuotes(); 
    const lastQuote = loadLastViewedQuote(); 
    if (lastQuote) {
        const currentFilteredQuotes = categoryFilter.value === 'all' ? quotes : quotes.filter(q => q.category === categoryFilter.value);
        const isLastQuoteInFilteredList = currentFilteredQuotes.some(q => 
            q.text === lastQuote.text && q.category === lastQuote.category
        );
        
        if (isLastQuoteInFilteredList) {
            quoteDisplay.innerHTML = `<p>"${lastQuote.text}"</p><footer>- ${lastQuote.category}</footer>`;
        } else {
            showRandomQuote(currentFilteredQuotes); 
        }
    } else {
        showRandomQuote(); 
    }
    createAddQuoteForm(); 
    setInterval(syncQuotes, SYNC_INTERVAL_MS);
    syncQuotes(); 
};