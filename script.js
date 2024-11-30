// Search functionality
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    const allCards = document.querySelectorAll('.agent-card');
    const tab1 = document.getElementById('tab1');
    const tab2 = document.getElementById('tab2');
    let hasResultsTab1 = false;
    let hasResultsTab2 = false;

    // If search is empty, reset to default view
    if (searchTerm === '') {
        allCards.forEach(card => card.style.display = 'block');
        return;
    }

    allCards.forEach(card => {
        const title = card.querySelector('h2').textContent.toLowerCase();
        const description = card.querySelector('.description').textContent.toLowerCase();
        const features = Array.from(card.querySelectorAll('.feature'))
            .map(f => f.textContent.toLowerCase());

        const isMatch = title.includes(searchTerm) || 
                       description.includes(searchTerm) || 
                       features.some(f => f.includes(searchTerm));

        card.style.display = isMatch ? 'block' : 'none';

        // Track which tab has results
        if (isMatch) {
            if (card.closest('#tab1')) hasResultsTab1 = true;
            if (card.closest('#tab2')) hasResultsTab2 = true;
        }
    });

    // Show message if no results in a tab
    handleNoResults(tab1, hasResultsTab1);
    handleNoResults(tab2, hasResultsTab2);
});

// Helper function to handle no results message
function handleNoResults(tabElement, hasResults) {
    let noResultsMsg = tabElement.querySelector('.no-results-message');
    
    if (!hasResults) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.textContent = 'No matching agents found';
            noResultsMsg.style.textAlign = 'center';
            noResultsMsg.style.padding = '2rem';
            noResultsMsg.style.color = '#6B7280';
            noResultsMsg.style.fontSize = '1.1rem';
            tabElement.querySelector('.agents-grid').appendChild(noResultsMsg);
        }
        noResultsMsg.style.display = 'block';
    } else if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
    }
}

// Toggle prompt visibility
function togglePrompt(promptId) {
    const promptContent = document.getElementById(promptId);
    const allPrompts = document.querySelectorAll('.prompt-content');
    
    allPrompts.forEach(prompt => {
        if (prompt.id !== promptId) {
            prompt.classList.remove('active');
        }
    });
    
    promptContent.classList.toggle('active');
}

// Copy prompt to clipboard
function copyPrompt(promptId) {
    const promptContent = document.getElementById(promptId);
    const textToCopy = promptContent.querySelector('.prompt-text').textContent.trim();
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        const copyBtn = promptContent.parentElement.querySelector('.copy-btn');
        copyBtn.textContent = 'Copied to Clipboard!';
        copyBtn.style.backgroundColor = '#e5e7eb';
        
        setTimeout(() => {
            copyBtn.textContent = 'Copy Prompt';
            copyBtn.style.backgroundColor = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        const copyBtn = promptContent.parentElement.querySelector('.copy-btn');
        copyBtn.textContent = 'Failed to Copy';
        setTimeout(() => {
            copyBtn.textContent = 'Copy Prompt';
        }, 2000);
    });
}

// Tab switching functionality
function switchTab(tabNumber) {
    // Update tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab')[tabNumber - 1].classList.add('active');
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`tab${tabNumber}`).classList.add('active');

    // Clear search when switching tabs
    document.getElementById('searchInput').value = '';
    document.querySelectorAll('.agent-card').forEach(card => {
        card.style.display = 'block';
    });
    document.querySelectorAll('.no-results-message').forEach(msg => {
        if (msg) msg.style.display = 'none';
    });
}

// Add smooth scroll behavior when clicking on cards
document.querySelectorAll('.view-prompt-btn').forEach(button => {
    button.addEventListener('click', () => {
        const card = button.closest('.agent-card');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
});
