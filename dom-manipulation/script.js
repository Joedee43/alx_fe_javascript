// const quotes = [
//     { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
//     { text: "Innovation distinguishes between a leader and a follower.", category: "Technology" },
//     { text: "Strive not to be a success, but rather to be of value.", category: "Life" },
//     { text: "The mind is everything. What you think you become.", category: "Philosophy" }
// ];
// const quoteDisplay = document.getElementById('quoteDisplay');
// const newQuoteButton = document.getElementById('newQuote');
// const addQuoteButton = document.getElementById('addQuoteBtn');
// function showRandomQuote() {
//     const randomIndex = Math.floor(Math.random() * quotes.length);
//     const randomQuote = quotes[randomIndex];
//     const quoteParagraph = document.createElement('p');
//     quoteParagraph.textContent = `"${randomQuote.text}"`;
//     const quoteFooter = document.createElement('footer');
//     quoteFooter.textContent = `- ${randomQuote.category}`;
//     quoteDisplay.innerHTML = '';
//     quoteDisplay.appendChild(quoteParagraph);
//     quoteDisplay.appendChild(quoteFooter);
// }


// function createAddQuoteForm() {
//     console.log("Add quote form is ready.");
// }

// function addQuote() {
//     const newQuoteTextInput = document.getElementById('newQuoteText');
//     const newQuoteCategoryInput = document.getElementById('newQuoteCategory');

//     const text = newQuoteTextInput.value.trim();
//     const category = newQuoteCategoryInput.value.trim();

//     if (text && category) {
//         const newQuote = { text, category };
//         quotes.push(newQuote);
//         newQuoteTextInput.value = '';
//         newQuoteCategoryInput.value = '';
//         alert("New quote added successfully!");
//         quoteDisplay.innerHTML = `<p>"${text}"</p><footer>- ${category}</footer>`;
//     } else {
//         alert("Please enter both a quote and a category.");
//     }
// }
// newQuoteButton.addEventListener('click', showRandomQuote);
// addQuoteButton.addEventListener('click', addQuote);
// window.onload = function() {
//     showRandomQuote();
//     createAddQuoteForm(); 
// };
// Initial array of quote objects
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Technology" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Life" },
    { text: "The mind is everything. What you think you become.", category: "Philosophy" }
];

// Get references to the DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const addQuoteButton = document.getElementById('addQuoteBtn');
const exportQuotesButton = document.getElementById('exportQuotesBtn');
const importFileInput = document.getElementById('importFile');

/**
 * Saves the current quotes array to local storage.
 * This function should be called whenever the quotes array is modified.
 */
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

/**
 * Loads quotes from local storage when the application initializes.
 * If no quotes are found in local storage, it uses the default quotes.
 */
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

/**
 * Saves the last viewed quote to session storage.
 * This ensures that if the user navigates away and comes back within the same session,
 * the last seen quote can be re-displayed.
 * @param {object} quote - The quote object to save.
 */
function saveLastViewedQuote(quote) {
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

/**
 * Loads the last viewed quote from session storage.
 * @returns {object|null} The last viewed quote object, or null if none is found.
 */
function loadLastViewedQuote() {
    const storedLastQuote = sessionStorage.getItem('lastViewedQuote');
    return storedLastQuote ? JSON.parse(storedLastQuote) : null;
}

/**
 * Selects a random quote from the array and updates the DOM to display it.
 * Also saves the displayed quote to session storage.
 */
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = `<p>"No quotes available. Add some!"</p><footer>- App</footer>`;
        saveLastViewedQuote({ text: "No quotes available. Add some!", category: "App" });
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Create the HTML content for the quote
    const quoteParagraph = document.createElement('p');
    quoteParagraph.textContent = `"${randomQuote.text}"`;

    const quoteFooter = document.createElement('footer');
    quoteFooter.textContent = `- ${randomQuote.category}`;

    // Clear the previous quote and append the new one
    quoteDisplay.innerHTML = '';
    quoteDisplay.appendChild(quoteParagraph);
    quoteDisplay.appendChild(quoteFooter);

    // Save the current quote to session storage
    saveLastViewedQuote(randomQuote);
}

/**
 * Dynamically creates the form for adding new quotes.
 * This function is mainly for logging readiness as the HTML structure provides the form.
 */
function createAddQuoteForm() {
    console.log("Add quote form is ready.");
}

/**
 * Adds a new quote to the quotes array from user input, updates the DOM,
 * and saves the updated quotes to local storage.
 */
function addQuote() {
    const newQuoteTextInput = document.getElementById('newQuoteText');
    const newQuoteCategoryInput = document.getElementById('newQuoteCategory');

    const text = newQuoteTextInput.value.trim();
    const category = newQuoteCategoryInput.value.trim();

    // Basic validation
    if (text && category) {
        const newQuote = { text, category };
        quotes.push(newQuote);
        saveQuotes(); // Save to local storage after adding
        
        newQuoteTextInput.value = '';
        newQuoteCategoryInput.value = '';

        // Display confirmation message instead of alert for better UX
        displayMessage("New quote added successfully!");
        
        // Display the newly added quote
        quoteDisplay.innerHTML = `<p>"${text}"</p><footer>- ${category}</footer>`;
        saveLastViewedQuote(newQuote); // Save to session storage
    } else {
        displayMessage("Please enter both a quote and a category.", "error");
    }
}

/**
 * Exports the current quotes array to a JSON file.
 */
function exportToJsonFile() {
    // Create a Blob from the quotes array, converted to a JSON string
    const dataStr = JSON.stringify(quotes, null, 2); // null, 2 for pretty printing
    const blob = new Blob([dataStr], { type: 'application/json' });

    // Create an anchor element and set its properties for download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json'; // Suggested file name
    
    // Programmatically click the anchor to trigger download
    document.body.appendChild(a); // Append to body is good practice for programmatic clicks
    a.click();
    document.body.removeChild(a); // Clean up the element
    URL.revokeObjectURL(url); // Clean up the URL object

    displayMessage("Quotes exported successfully!");
}

/**
 * Imports quotes from a selected JSON file.
 * @param {Event} event - The change event from the file input.
 */
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
            
            // Validate if imported data is an array of objects with text and category
            const isValid = Array.isArray(importedQuotes) && importedQuotes.every(
                q => typeof q === 'object' && q !== null && typeof q.text === 'string' && typeof q.category === 'string'
            );

            if (isValid) {
                // Add new quotes to the existing array, avoiding duplicates if desired
                // For simplicity, we'll just push them here.
                quotes.push(...importedQuotes);
                saveQuotes(); // Save updated quotes to local storage
                displayMessage('Quotes imported successfully!');
                // Optionally show one of the imported quotes
                showRandomQuote(); 
            } else {
                displayMessage("Invalid JSON format. Please ensure it's an array of quote objects.", "error");
            }
        } catch (error) {
            console.error("Error parsing JSON:", error);
            displayMessage("Failed to parse JSON file. Please ensure it's a valid JSON.", "error");
        }
    };
    fileReader.onerror = function() {
        displayMessage("Error reading file.", "error");
    };
    fileReader.readAsText(file);
}

/**
 * Displays a temporary message to the user (instead of alert).
 * @param {string} message - The message to display.
 * @param {string} type - 'success' or 'error' for styling.
 */
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

    // Fade out after 3 seconds
    setTimeout(() => {
        msgDiv.style.opacity = '0';
    }, 3000);
}


// --- Event Listeners ---

// Event listener for "Show New Quote" button
newQuoteButton.addEventListener('click', showRandomQuote);

// Event listener for "Add Quote" button
addQuoteButton.addEventListener('click', addQuote);

// Event listener for "Export Quotes" button
exportQuotesButton.addEventListener('click', exportToJsonFile);

// Event listener for "Import File" input
importFileInput.addEventListener('change', importFromJsonFile);

// --- Initial Setup ---
// This function runs when the entire page (including all elements) has loaded.
window.onload = function() {
    loadQuotes(); // Load quotes from local storage first
    const lastQuote = loadLastViewedQuote(); // Try to load last viewed quote
    if (lastQuote) {
        // Display the last viewed quote if available
        quoteDisplay.innerHTML = `<p>"${lastQuote.text}"</p><footer>- ${lastQuote.category}</footer>`;
    } else {
        // Otherwise, show a random quote
        showRandomQuote(); 
    }
    createAddQuoteForm(); // Call this function to log readiness
};