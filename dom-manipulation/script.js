const quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Technology" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Life" },
    { text: "The mind is everything. What you think you become.", category: "Philosophy" }
];
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const addQuoteButton = document.getElementById('addQuoteBtn');
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    const quoteParagraph = document.createElement('p');
    quoteParagraph.textContent = `"${randomQuote.text}"`;
    const quoteFooter = document.createElement('footer');
    quoteFooter.textContent = `- ${randomQuote.category}`;
    quoteDisplay.innerHTML = '';
    quoteDisplay.appendChild(quoteParagraph);
    quoteDisplay.appendChild(quoteFooter);
}


function createAddQuoteForm() {
    console.log("Add quote form is ready.");
}

function addQuote() {
    const newQuoteTextInput = document.getElementById('newQuoteText');
    const newQuoteCategoryInput = document.getElementById('newQuoteCategory');

    const text = newQuoteTextInput.value.trim();
    const category = newQuoteCategoryInput.value.trim();

    if (text && category) {
        const newQuote = { text, category };
        quotes.push(newQuote);
        newQuoteTextInput.value = '';
        newQuoteCategoryInput.value = '';
        alert("New quote added successfully!");
        quoteDisplay.innerHTML = `<p>"${text}"</p><footer>- ${category}</footer>`;
    } else {
        alert("Please enter both a quote and a category.");
    }
}
newQuoteButton.addEventListener('click', showRandomQuote);
addQuoteButton.addEventListener('click', addQuote);
window.onload = function() {
    showRandomQuote();
    createAddQuoteForm(); 
};