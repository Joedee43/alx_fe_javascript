// let quotes = [
//     { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
//     { text: "Innovation distinguishes between a leader and a follower.", category: "Technology" },
//     { text: "Strive not to be a success, but rather to be of value.", category: "Life" },
//     { text: "The mind is everything. What you think you become.", category: "Philosophy" }
// ];

// // Get references to the DOM elements
// const quoteDisplay = document.getElementById('quoteDisplay');
// const newQuoteButton = document.getElementById('newQuote');
// const addQuoteButton = document.getElementById('addQuoteBtn');
// const exportQuotesButton = document.getElementById('exportQuotesBtn');
// const importFileInput = document.getElementById('importFile');
// const categoryFilter = document.getElementById('categoryFilter'); // Reference to the category filter dropdown

// /**
//  * Saves the current 'quotes' array to local storage.
//  * This function should be called whenever the 'quotes' array is modified (e.g., adding, importing).
//  */
// function saveQuotes() {
//     try {
//         localStorage.setItem('quotes', JSON.stringify(quotes));
//     } catch (e) {
//         console.error("Error saving quotes to local storage:", e);
//         displayMessage("Error saving data. Storage might be full.", "error");
//     }
// }

// /**
//  * Loads quotes from local storage when the application initializes.
//  * If no quotes are found in local storage, the default 'quotes' array is used.
//  */
// function loadQuotes() {
//     try {
//         const storedQuotes = localStorage.getItem('quotes');
//         if (storedQuotes) {
//             quotes = JSON.parse(storedQuotes);
//         }
//     } catch (e) {
//         console.error("Error loading quotes from local storage:", e);
//         displayMessage("Error loading saved quotes. Data might be corrupted.", "error");
//         // Fallback to default quotes if loading fails
//         quotes = [
//             { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
//             { text: "Innovation distinguishes between a leader and a follower.", category: "Technology" },
//             { text: "Strive not to be a success, but rather to be of value.", category: "Life" },
//             { text: "The mind is everything. What you think you become.", category: "Philosophy" }
//         ];
//     }
// }

// /**
//  * Saves the last viewed quote to session storage.
//  * This allows the application to remember the last displayed quote across browser tabs/windows
//  * within the same session, but not after the browser is closed.
//  * @param {object} quote - The quote object currently being displayed.
//  */
// function saveLastViewedQuote(quote) {
//     try {
//         sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
//     } catch (e) {
//         console.error("Error saving last viewed quote to session storage:", e);
//     }
// }

// /**
//  * Loads the last viewed quote from session storage.
//  * @returns {object|null} The last viewed quote object, or null if none is found or an error occurs.
//  */
// function loadLastViewedQuote() {
//     try {
//         const storedLastQuote = sessionStorage.getItem('lastViewedQuote');
//         return storedLastQuote ? JSON.parse(storedLastQuote) : null;
//     } catch (e) {
//         console.error("Error loading last viewed quote from session storage:", e);
//         return null;
//     }
// }

// /**
//  * Saves the currently selected category filter to local storage.
//  * This persists the user's filter preference across browser sessions.
//  * @param {string} category - The value of the selected category (e.g., 'all', 'Inspiration').
//  */
// function saveSelectedCategory(category) {
//     try {
//         localStorage.setItem('selectedCategory', category);
//     } catch (e) {
//         console.error("Error saving selected category to local storage:", e);
//     }
// }

// /**
//  * Loads the last selected category filter from local storage.
//  * @returns {string|null} The last selected category, or null if none is found.
//  */
// function loadSelectedCategory() {
//     try {
//         return localStorage.getItem('selectedCategory');
//     } catch (e) {
//         console.error("Error loading selected category from local storage:", e);
//         return null;
//     }
// }

// /**
//  * Selects a random quote from a given array of quotes and updates the DOM to display it.
//  * If no filtered quotes are provided, it defaults to the global 'quotes' array.
//  * Also saves the displayed quote to session storage.
//  * @param {Array} filteredQuotes - Optional. The array of quotes to pick from (after filtering).
//  */
// function showRandomQuote(filteredQuotes = quotes) {
//     // If no quotes are available in the filtered list
//     if (filteredQuotes.length === 0) {
//         quoteDisplay.innerHTML = `<p>"No quotes available for this category. Try another filter or add new quotes!"</p><footer>- App</footer>`;
//         saveLastViewedQuote({ text: "No quotes available for this category.", category: "App" });
//         return;
//     }

//     // Get a random index from the provided filtered quotes array
//     const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
//     const randomQuote = filteredQuotes[randomIndex];

//     // Create a new paragraph element for the quote text
//     const quoteParagraph = document.createElement('p');
//     quoteParagraph.textContent = `"${randomQuote.text}"`;

//     // Create a new footer element for the quote category/author
//     const quoteFooter = document.createElement('footer');
//     quoteFooter.textContent = `- ${randomQuote.category}`;

//     // Clear any previously displayed content in the quoteDisplay div
//     quoteDisplay.innerHTML = '';
//     // Append the new quote text and footer to the display area
//     quoteDisplay.appendChild(quoteParagraph);
//     quoteDisplay.appendChild(quoteFooter);

//     // Save the currently displayed quote to session storage
//     saveLastViewedQuote(randomQuote);
// }

// /**
//  * Dynamically populates the category filter dropdown with unique categories
//  * extracted from the current 'quotes' array.
//  * Ensures the "All Categories" option is always present.
//  */
// function populateCategories() {
//     // Extract unique categories and add 'all' as the first option
//     const categories = ['all', ...new Set(quotes.map(quote => quote.category))].sort(); // Sort categories alphabetically
    
//     // Clear existing options, then add the "All Categories" option back
//     categoryFilter.innerHTML = '<option value="all">All Categories</option>';

//     // Add unique categories to the dropdown
//     categories.forEach(category => {
//         if (category !== 'all') { // Avoid duplicating 'all' if it somehow gets into the quote categories
//             const option = document.createElement('option');
//             option.value = category;
//             option.textContent = category;
//             categoryFilter.appendChild(option);
//         }
//     });

//     // Restore the last selected category from local storage if it's a valid option
//     const lastSelectedCategory = loadSelectedCategory();
//     if (lastSelectedCategory && Array.from(categoryFilter.options).some(option => option.value === lastSelectedCategory)) {
//         categoryFilter.value = lastSelectedCategory;
//     } else {
//         categoryFilter.value = 'all'; // Default to "All Categories" if no valid stored preference
//     }
// }

// /**
//  * Filters the 'quotes' array based on the selected category in the dropdown.
//  * It then displays a random quote from the filtered list and saves the selected category.
//  */
// function filterQuotes() {
//     const selectedCategory = categoryFilter.value;
//     saveSelectedCategory(selectedCategory); // Persist the selected filter

//     let filteredQuotes = [];
//     if (selectedCategory === 'all') {
//         // If "All Categories" is selected, use the entire quotes array
//         filteredQuotes = quotes;
//     } else {
//         // Otherwise, filter quotes by the selected category
//         filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
//     }

//     // Display a random quote from the (potentially) filtered list
//     showRandomQuote(filteredQuotes);
// }

// /**
//  * Adds a new quote to the 'quotes' array based on user input from the form.
//  * It validates inputs, updates local storage, repopulates categories, and displays a message.
//  */
// function addQuote() {
//     const newQuoteTextInput = document.getElementById('newQuoteText');
//     const newQuoteCategoryInput = document.getElementById('newQuoteCategory');

//     const text = newQuoteTextInput.value.trim();
//     const category = newQuoteCategoryInput.value.trim();

//     // Basic validation: ensure both text and category are provided
//     if (text && category) {
//         const newQuote = { text, category };
//         quotes.push(newQuote); // Add the new quote to the array
//         saveQuotes(); // Save the updated quotes array to local storage
        
//         // Clear the input fields after adding
//         newQuoteTextInput.value = '';
//         newQuoteCategoryInput.value = '';

//         // Repopulate categories because a new, unique category might have been introduced
//         populateCategories(); 

//         // After adding, determine which quote to display and which filter to set:
//         const currentSelectedCategory = categoryFilter.value;
//         if (currentSelectedCategory === 'all' || currentSelectedCategory === category) {
//             // If the filter is "All Categories" or matches the new quote's category,
//             // set the filter to the new quote's category and display the new quote.
//             categoryFilter.value = category;
//             saveSelectedCategory(category);
//             quoteDisplay.innerHTML = `<p>"${text}"</p><footer>- ${category}</footer>`;
//             saveLastViewedQuote(newQuote);
//         } else {
//             // If a different category filter is active, just re-apply the filter
//             // to show a random quote from the currently filtered list.
//             filterQuotes(); 
//         }

//         displayMessage("New quote added successfully!"); // Show success message
//     } else {
//         displayMessage("Please enter both a quote and a category.", "error"); // Show error message
//     }
// }

// /**
//  * Exports the current 'quotes' array as a JSON file, triggering a browser download.
//  */
// function exportToJsonFile() {
//     // Convert the 'quotes' array to a JSON string, pretty-printed for readability
//     const dataStr = JSON.stringify(quotes, null, 2); 
//     // Create a Blob object from the JSON string with application/json MIME type
//     const blob = new Blob([dataStr], { type: 'application/json' });

//     // Create a URL for the Blob object
//     const url = URL.createObjectURL(blob);
//     // Create a temporary anchor element
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'quotes.json'; // Set the download file name
    
//     // Append the anchor to the body, programmatically click it to trigger download, then remove it
//     document.body.appendChild(a); 
//     a.click();
//     document.body.removeChild(a);
//     // Revoke the object URL to free up memory
//     URL.revokeObjectURL(url);

//     displayMessage("Quotes exported successfully!"); // Show success message
// }

// /**
//  * Imports quotes from a JSON file selected by the user via a file input.
//  * It reads the file, parses JSON, validates data, merges into existing quotes,
//  * updates local storage, and refreshes the display.
//  * @param {Event} event - The change event from the file input element.
//  */
// function importFromJsonFile(event) {
//     const file = event.target.files[0]; // Get the selected file
//     if (!file) {
//         displayMessage("No file selected.", "error");
//         return;
//     }

//     const fileReader = new FileReader(); // Create a new FileReader to read the file
//     fileReader.onload = function(e) {
//         try {
//             // Attempt to parse the file content as JSON
//             const importedQuotes = JSON.parse(e.target.result);
            
//             // Validate the imported data: must be an array of objects with 'text' and 'category'
//             const isValid = Array.isArray(importedQuotes) && importedQuotes.every(
//                 q => typeof q === 'object' && q !== null && typeof q.text === 'string' && typeof q.category === 'string'
//             );

//             if (isValid) {
//                 // Merge new unique quotes into the existing array to avoid exact text duplicates.
//                 // This creates a Set of current quote texts for efficient lookup.
//                 const currentQuoteTexts = new Set(quotes.map(q => q.text));
//                 const newUniqueQuotes = importedQuotes.filter(iq => !currentQuoteTexts.has(iq.text));
//                 quotes.push(...newUniqueQuotes); // Add only truly new quotes
                
//                 saveQuotes(); // Save the updated combined quotes to local storage
//                 populateCategories(); // Update the category filter dropdown with any new categories
//                 displayMessage('Quotes imported successfully!'); // Show success message
//                 filterQuotes(); // Re-apply the current filter and display a random quote from the result
//             } else {
//                 displayMessage("Invalid JSON format. Please ensure it's an array of quote objects with 'text' and 'category' properties.", "error");
//             }
//         } catch (error) {
//             console.error("Error parsing JSON:", error);
//             displayMessage("Failed to parse JSON file. Please ensure it's a valid JSON.", "error");
//         }
//     };
//     fileReader.onerror = function() {
//         console.error("Error reading file:", fileReader.error);
//         displayMessage("Error reading file. Please try again.", "error");
//     };
//     fileReader.readAsText(file); // Read the file content as text
//     // Reset the file input to allow selecting the same file again if needed
//     event.target.value = ''; 
// }

// /**
//  * Displays a temporary, non-blocking message to the user.
//  * This is used instead of 'alert()' for a better user experience.
//  * @param {string} message - The message text to display.
//  * @param {string} type - 'success' or 'error' to determine message styling.
//  */
// function displayMessage(message, type = "success") {
//     let msgDiv = document.getElementById('appMessage'); // Try to get an existing message div
//     if (!msgDiv) {
//         // If it doesn't exist, create it and append to the body
//         msgDiv = document.createElement('div');
//         msgDiv.id = 'appMessage';
//         document.body.appendChild(msgDiv);
//         // Apply initial styles for positioning and transition
//         Object.assign(msgDiv.style, {
//             position: 'fixed',
//             bottom: '20px',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             padding: '12px 25px',
//             borderRadius: '8px',
//             color: 'white',
//             fontWeight: 'bold',
//             zIndex: '1000',
//             transition: 'opacity 0.5s ease-in-out',
//             opacity: '0', // Start hidden
//             textAlign: 'center',
//             minWidth: '200px',
//             boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
//         });
//     }

//     // Set background color based on message type
//     if (type === "success") {
//         msgDiv.style.backgroundColor = '#4CAF50'; // Green for success
//     } else if (type === "error") {
//         msgDiv.style.backgroundColor = '#F44336'; // Red for error
//     } else {
//         msgDiv.style.backgroundColor = '#333'; // Default dark color
//     }

//     msgDiv.textContent = message; // Set the message text
//     msgDiv.style.opacity = '1'; // Make the message visible

//     // Fade out the message after 3 seconds
//     setTimeout(() => {
//         msgDiv.style.opacity = '0';
//     }, 3000);
// }


// // --- Event Listeners ---

// // Event listener for the "Show New Quote" button.
// // When clicked, it re-applies the current filter and shows a new random quote from that filtered list.
// newQuoteButton.addEventListener('click', () => filterQuotes()); 

// // Event listener for the "Add Quote" button.
// addQuoteButton.addEventListener('click', addQuote);

// // Event listener for the "Export Quotes (JSON)" button.
// exportQuotesButton.addEventListener('click', exportToJsonFile);

// // Event listener for the "Import Quotes (JSON)" file input.
// // 'change' event fires when a file is selected.
// importFileInput.addEventListener('change', importFromJsonFile);

// // Event listener for the Category Filter dropdown.
// // 'change' event fires when a new option is selected.
// categoryFilter.addEventListener('change', filterQuotes);

// // --- Initial Setup (runs when the page and all resources are fully loaded) ---
// window.onload = function() {
//     loadQuotes(); // 1. Load quotes from local storage first.
//     populateCategories(); // 2. Populate the category filter dropdown based on all available quotes.

//     // 3. Try to restore the last selected category filter.
//     const lastSelectedCategory = loadSelectedCategory();
//     if (lastSelectedCategory && Array.from(categoryFilter.options).some(option => option.value === lastSelectedCategory)) {
//         categoryFilter.value = lastSelectedCategory;
//     } else {
//         categoryFilter.value = 'all'; // Default to 'all' if no valid category was stored.
//     }

//     // 4. Apply the loaded/default filter and display a random quote from the resulting list.
//     filterQuotes(); 

//     // 5. After initial display, attempt to load and display the *specific* last viewed quote from session storage.
//     // This provides a "resume where you left off" experience within the same session.
//     const lastQuote = loadLastViewedQuote(); 
//     if (lastQuote) {
//         // Check if the last viewed quote exists in the currently filtered list.
//         const currentFilteredQuotes = categoryFilter.value === 'all' ? quotes : quotes.filter(q => q.category === categoryFilter.value);
//         const isLastQuoteInFilteredList = currentFilteredQuotes.some(q => 
//             q.text === lastQuote.text && q.category === lastQuote.category
//         );
        
//         if (isLastQuoteInFilteredList) {
//             // If it does, display it directly.
//             quoteDisplay.innerHTML = `<p>"${lastQuote.text}"</p><footer>- ${lastQuote.category}</footer>`;
//         } else {
//             // If the last viewed quote is not in the current filtered list (e.g., filter changed),
//             // show a random quote from the currently filtered set.
//             showRandomQuote(currentFilteredQuotes); 
//         }
//     } else {
//         // If there's no last viewed quote in session storage, just ensure a random quote is shown based on the filter.
//         showRandomQuote(); 
//     }
    
//     // As per previous task requirements, log that the add quote form is ready.
//     // This function doesn't dynamically create the form but confirms its readiness.
//     createAddQuoteForm(); 
// };

// Initial array of quote objects
// This array will be overwritten by local storage if data exists there.
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Technology" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Life" },
    { text: "The mind is everything. What you think you become.", category: "Philosophy" }
];

// Server endpoint for mock API (JSONPlaceholder for posts)
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';
// Interval for periodic syncing (e.g., every 10 seconds)
const SYNC_INTERVAL_MS = 10000;

// Get references to the DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const addQuoteButton = document.getElementById('addQuoteBtn');
const exportQuotesButton = document.getElementById('exportQuotesBtn');
const importFileInput = document.getElementById('importFile');
const categoryFilter = document.getElementById('categoryFilter'); // Reference to the category filter dropdown

/**
 * Saves the current 'quotes' array to local storage.
 * This function should be called whenever the 'quotes' array is modified (e.g., adding, importing).
 */
function saveQuotes() {
    try {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    } catch (e) {
        console.error("Error saving quotes to local storage:", e);
        displayMessage("Error saving data. Storage might be full.", "error");
    }
}

/**
 * Loads quotes from local storage when the application initializes.
 * If no quotes are found in local storage, the default 'quotes' array is used.
 */
function loadQuotes() {
    try {
        const storedQuotes = localStorage.getItem('quotes');
        if (storedQuotes) {
            quotes = JSON.parse(storedQuotes);
        }
    } catch (e) {
        console.error("Error loading quotes from local storage:", e);
        displayMessage("Error loading saved quotes. Data might be corrupted.", "error");
        // Fallback to default quotes if loading fails
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
            { text: "Innovation distinguishes between a leader and a follower.", category: "Technology" },
            { text: "Strive not to be a success, but rather to be of value.", category: "Life" },
            { text: "The mind is everything. What you think you become.", category: "Philosophy" }
        ];
    }
}

/**
 * Saves the last viewed quote to session storage.
 * This allows the application to remember the last displayed quote across browser tabs/windows
 * within the same session, but not after the browser is closed.
 * @param {object} quote - The quote object currently being displayed.
 */
function saveLastViewedQuote(quote) {
    try {
        sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
    } catch (e) {
        console.error("Error saving last viewed quote to session storage:", e);
    }
}

/**
 * Loads the last viewed quote from session storage.
 * @returns {object|null} The last viewed quote object, or null if none is found or an error occurs.
 */
function loadLastViewedQuote() {
    try {
        const storedLastQuote = sessionStorage.getItem('lastViewedQuote');
        return storedLastQuote ? JSON.parse(storedLastQuote) : null;
    } catch (e) {
        console.error("Error loading last viewed quote from session storage:", e);
        return null;
    }
}

/**
 * Saves the currently selected category filter to local storage.
 * This persists the user's filter preference across browser sessions.
 * @param {string} category - The value of the selected category (e.g., 'all', 'Inspiration').
 */
function saveSelectedCategory(category) {
    try {
        localStorage.setItem('selectedCategory', category);
    } catch (e) {
        console.error("Error saving selected category to local storage:", e);
    }
}

/**
 * Loads the last selected category filter from local storage.
 * @returns {string|null} The last selected category, or null if none is found.
 */
function loadSelectedCategory() {
    try {
        return localStorage.getItem('selectedCategory');
    } catch (e) {
        console.error("Error loading selected category from local storage:", e);
        return null;
    }
}

/**
 * Selects a random quote from a given array of quotes and updates the DOM to display it.
 * If no filtered quotes are provided, it defaults to the global 'quotes' array.
 * Also saves the displayed quote to session storage.
 * @param {Array} filteredQuotes - Optional. The array of quotes to pick from (after filtering).
 */
function showRandomQuote(filteredQuotes = quotes) {
    // If no quotes are available in the filtered list
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = `<p>"No quotes available for this category. Try another filter or add new quotes!"</p><footer>- App</footer>`;
        saveLastViewedQuote({ text: "No quotes available for this category.", category: "App" });
        return;
    }

    // Get a random index from the provided filtered quotes array
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    // Create a new paragraph element for the quote text
    const quoteParagraph = document.createElement('p');
    quoteParagraph.textContent = `"${randomQuote.text}"`;

    // Create a new footer element for the quote category/author
    const quoteFooter = document.createElement('footer');
    quoteFooter.textContent = `- ${randomQuote.category}`;

    // Clear any previously displayed content in the quoteDisplay div
    quoteDisplay.innerHTML = '';
    // Append the new quote text and footer to the display area
    quoteDisplay.appendChild(quoteParagraph);
    quoteDisplay.appendChild(quoteFooter);

    // Save the currently displayed quote to session storage
    saveLastViewedQuote(randomQuote);
}

/**
 * Dynamically populates the category filter dropdown with unique categories
 * extracted from the current 'quotes' array.
 * Ensures the "All Categories" option is always present.
 */
function populateCategories() {
    // Extract unique categories and add 'all' as the first option
    const categories = ['all', ...new Set(quotes.map(quote => quote.category))].sort(); // Sort categories alphabetically
    
    // Clear existing options, then add the "All Categories" option back
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    // Add unique categories to the dropdown
    categories.forEach(category => {
        if (category !== 'all') { // Avoid duplicating 'all' if it somehow gets into the quote categories
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        }
    });

    // Restore the last selected category from local storage if it's a valid option
    const lastSelectedCategory = loadSelectedCategory();
    if (lastSelectedCategory && Array.from(categoryFilter.options).some(option => option.value === lastSelectedCategory)) {
        categoryFilter.value = lastSelectedCategory;
    } else {
        categoryFilter.value = 'all'; // Default to "All Categories" if no valid stored preference
    }
}

/**
 * Filters the 'quotes' array based on the selected category in the dropdown.
 * It then displays a random quote from the filtered list and saves the selected category.
 */
function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    saveSelectedCategory(selectedCategory); // Persist the selected filter

    let filteredQuotes = [];
    if (selectedCategory === 'all') {
        // If "All Categories" is selected, use the entire quotes array
        filteredQuotes = quotes;
    } else {
        // Otherwise, filter quotes by the selected category
        filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }

    // Display a random quote from the (potentially) filtered list
    showRandomQuote(filteredQuotes);
}

/**
 * Adds a new quote to the 'quotes' array based on user input from the form.
 * It validates inputs, updates local storage, repopulates categories, and displays a message.
 * Also attempts to post the new quote to the simulated server.
 */
async function addQuote() {
    const newQuoteTextInput = document.getElementById('newQuoteText');
    const newQuoteCategoryInput = document.getElementById('newQuoteCategory');

    const text = newQuoteTextInput.value.trim();
    const category = newQuoteCategoryInput.value.trim();

    // Basic validation: ensure both text and category are provided
    if (text && category) {
        const newQuote = { text, category };
        quotes.push(newQuote); // Add the new quote to the array
        saveQuotes(); // Save the updated quotes array to local storage
        
        // Clear the input fields after adding
        newQuoteTextInput.value = '';
        newQuoteCategoryInput.value = '';

        // Repopulate categories because a new, unique category might have been introduced
        populateCategories(); 

        // After adding, determine which quote to display and which filter to set:
        const currentSelectedCategory = categoryFilter.value;
        if (currentSelectedCategory === 'all' || currentSelectedCategory === category) {
            // If the filter is "All Categories" or matches the new quote's category,
            // set the filter to the new quote's category and display the new quote.
            categoryFilter.value = category;
            saveSelectedCategory(category);
            quoteDisplay.innerHTML = `<p>"${text}"</p><footer>- ${category}</footer>`;
            saveLastViewedQuote(newQuote);
        } else {
            // If a different category filter is active, just re-apply the filter
            // to show a random quote from the currently filtered list.
            filterQuotes(); 
        }

        displayMessage("New quote added successfully! Attempting to sync with server...", "success"); // Show success message
        await postQuoteToServer(newQuote); // Attempt to post to server
    } else {
        displayMessage("Please enter both a quote and a category.", "error"); // Show error message
    }
}

/**
 * Exports the current 'quotes' array as a JSON file, triggering a browser download.
 */
function exportToJsonFile() {
    // Convert the 'quotes' array to a JSON string, pretty-printed for readability
    const dataStr = JSON.stringify(quotes, null, 2); 
    // Create a Blob object from the JSON string with application/json MIME type
    const blob = new Blob([dataStr], { type: 'application/json' });

    // Create a URL for the Blob object
    const url = URL.createObjectURL(blob);
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json'; // Set the download file name
    
    // Append the anchor to the body, programmatically click it to trigger download, then remove it
    document.body.appendChild(a); 
    a.click();
    document.body.removeChild(a);
    // Revoke the object URL to free up memory
    URL.revokeObjectURL(url);

    displayMessage("Quotes exported successfully!"); // Show success message
}

/**
 * Imports quotes from a JSON file selected by the user via a file input.
 * It reads the file, parses JSON, validates data, merges into existing quotes,
 * updates local storage, and refreshes the display.
 * @param {Event} event - The change event from the file input element.
 */
function importFromJsonFile(event) {
    const file = event.target.files[0]; // Get the selected file
    if (!file) {
        displayMessage("No file selected.", "error");
        return;
    }

    const fileReader = new FileReader(); // Create a new FileReader to read the file
    fileReader.onload = function(e) {
        try {
            // Attempt to parse the file content as JSON
            const importedQuotes = JSON.parse(e.target.result);
            
            // Validate the imported data: must be an array of objects with 'text' and 'category'
            const isValid = Array.isArray(importedQuotes) && importedQuotes.every(
                q => typeof q === 'object' && q !== null && typeof q.text === 'string' && typeof q.category === 'string'
            );

            if (isValid) {
                // Merge new unique quotes into the existing array to avoid exact text duplicates.
                // This creates a Set of current quote texts for efficient lookup.
                const currentQuoteTexts = new Set(quotes.map(q => q.text));
                const newUniqueQuotes = importedQuotes.filter(iq => !currentQuoteTexts.has(iq.text));
                quotes.push(...newUniqueQuotes); // Add only truly new quotes
                
                saveQuotes(); // Save the updated combined quotes to local storage
                populateCategories(); // Update the category filter dropdown with any new categories
                displayMessage('Quotes imported successfully!'); // Show success message
                filterQuotes(); // Re-apply the current filter and display a random quote from the result
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
    fileReader.readAsText(file); // Read the file content as text
    // Reset the file input to allow selecting the same file again if needed
    event.target.value = ''; 
}

/**
 * Displays a temporary, non-blocking message to the user.
 * This is used instead of 'alert()' for a better user experience.
 * @param {string} message - The message text to display.
 * @param {string} type - 'success' or 'error' to determine message styling.
 */
function displayMessage(message, type = "success") {
    let msgDiv = document.getElementById('appMessage'); // Try to get an existing message div
    if (!msgDiv) {
        // If it doesn't exist, create it and append to the body
        msgDiv = document.createElement('div');
        msgDiv.id = 'appMessage';
        document.body.appendChild(msgDiv);
        // Apply initial styles for positioning and transition
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
            opacity: '0', // Start hidden
            textAlign: 'center',
            minWidth: '200px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        });
    }

    // Set background color based on message type
    if (type === "success") {
        msgDiv.style.backgroundColor = '#4CAF50'; // Green for success
    } else if (type === "error") {
        msgDiv.style.backgroundColor = '#F44336'; // Red for error
    } else {
        msgDiv.style.backgroundColor = '#333'; // Default dark color
    }

    msgDiv.textContent = message; // Set the message text
    msgDiv.style.opacity = '1'; // Make the message visible

    // Fade out the message after 3 seconds
    setTimeout(() => {
        msgDiv.style.opacity = '0';
    }, 3000);
}

/**
 * Fetches quotes from a simulated server (JSONPlaceholder).
 * In a real application, this would fetch actual quote data.
 * For JSONPlaceholder, we're simulating a generic post structure as quotes.
 * @returns {Promise<Array>} A promise that resolves to an array of quotes from the server.
 */
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(SERVER_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const serverData = await response.json();
        // JSONPlaceholder returns 'posts' with 'title' and 'body'.
        // We map them to 'text' and 'category' for our quote structure.
        return serverData.slice(0, 10).map(item => ({ // Limit to 10 for demonstration
            text: item.title,
            category: 'Server Quote' // Assign a generic category or parse from body
        }));
    } catch (error) {
        console.error("Could not fetch quotes from server:", error);
        displayMessage("Failed to fetch quotes from server.", "error");
        return []; // Return empty array on error
    }
}

/**
 * Posts a new quote to the simulated server (JSONPlaceholder).
 * In a real application, this would send new quote data to your backend.
 * @param {object} quote - The quote object to post.
 */
async function postQuoteToServer(quote) {
    try {
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            body: JSON.stringify({
                title: quote.text,
                body: quote.category, // Using body to store category for JSONPlaceholder
                userId: 1, // Dummy user ID
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


/**
 * Syncs local quotes with server data, applying a conflict resolution strategy.
 * Server data takes precedence. New server quotes are added, existing ones updated.
 */
async function syncQuotes() {
    displayMessage("Syncing with server...", "success");
    const serverQuotes = await fetchQuotesFromServer();
    
    let localQuotesUpdated = false;
    let conflictsResolved = 0;
    let newQuotesAdded = 0;

    // Create a Set of existing local quote texts for efficient lookup
    const currentLocalQuoteTexts = new Set(quotes.map(q => q.text));

    serverQuotes.forEach(serverQuote => {
        // Check if the server quote (by its text) already exists locally
        if (!currentLocalQuoteTexts.has(serverQuote.text)) {
            // If server quote doesn't exist locally, add it
            quotes.push(serverQuote);
            newQuotesAdded++;
            localQuotesUpdated = true;
        } else {
            // Conflict resolution: Server data takes precedence.
            // If a quote with the same text exists locally, we check if the category differs.
            // If it differs, we update the local quote with the server's category.
            const localQuote = quotes.find(q => q.text === serverQuote.text);
            if (localQuote && localQuote.category !== serverQuote.category) {
                localQuote.category = serverQuote.category;
                conflictsResolved++;
                localQuotesUpdated = true;
            }
        }
    });
    
    if (newQuotesAdded > 0 || conflictsResolved > 0) {
        saveQuotes(); // Save updated quotes array to local storage
        populateCategories(); // Update categories dropdown
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

    // After sync, re-filter and show a random quote to reflect changes
    filterQuotes();
}


// --- Event Listeners ---

// Event listener for the "Show New Quote" button.
// When clicked, it re-applies the current filter and shows a new random quote from that filtered list.
newQuoteButton.addEventListener('click', () => filterQuotes()); 

// Event listener for the "Add Quote" button.
addQuoteButton.addEventListener('click', addQuote);

// Event listener for the "Export Quotes (JSON)" button.
exportQuotesButton.addEventListener('click', exportToJsonFile);

// Event listener for the "Import Quotes (JSON)" file input.
// 'change' event fires when a file is selected.
importFileInput.addEventListener('change', importFromJsonFile);

// Event listener for the Category Filter dropdown.
// 'change' event fires when a new option is selected.
categoryFilter.addEventListener('change', filterQuotes);

// --- Initial Setup (runs when the page and all resources are fully loaded) ---
window.onload = function() {
    loadQuotes(); // 1. Load quotes from local storage first.
    populateCategories(); // 2. Populate the category filter dropdown based on all available quotes.

    // 3. Try to restore the last selected category filter.
    const lastSelectedCategory = loadSelectedCategory();
    if (lastSelectedCategory && Array.from(categoryFilter.options).some(option => option.value === lastSelectedCategory)) {
        categoryFilter.value = lastSelectedCategory;
    } else {
        categoryFilter.value = 'all'; // Default to 'all' if no valid category was stored.
    }

    // 4. Apply the loaded/default filter and display a random quote from the resulting list.
    filterQuotes(); 

    // 5. After initial display, attempt to load and display the *specific* last viewed quote from session storage.
    // This provides a "resume where you left off" experience within the same session.
    const lastQuote = loadLastViewedQuote(); 
    if (lastQuote) {
        // Check if the last viewed quote exists in the currently filtered list.
        const currentFilteredQuotes = categoryFilter.value === 'all' ? quotes : quotes.filter(q => q.category === categoryFilter.value);
        const isLastQuoteInFilteredList = currentFilteredQuotes.some(q => 
            q.text === lastQuote.text && q.category === lastQuote.category
        );
        
        if (isLastQuoteInFilteredList) {
            // If it does, display it directly.
            quoteDisplay.innerHTML = `<p>"${lastQuote.text}"</p><footer>- ${lastQuote.category}</footer>`;
        } else {
            // If the last viewed quote is not in the current filtered list (e.g., filter changed),
            // show a random quote from the currently filtered set.
            showRandomQuote(currentFilteredQuotes); 
        }
    } else {
        // If there's no last viewed quote in session storage, just ensure a random quote is shown based on the filter.
        showRandomQuote(); 
    }
    
    // As per previous task requirements, log that the add quote form is ready.
    // This function doesn't dynamically create the form but confirms its readiness.
    createAddQuoteForm(); 

    // Start periodic syncing with the server
    setInterval(syncQuotes, SYNC_INTERVAL_MS);
    syncQuotes(); // Perform an initial sync on load
};