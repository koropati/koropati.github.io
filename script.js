// Configuration - EDIT THESE VALUES
const GITHUB_USERNAME = 'koropati'; // Change to your GitHub username
const GITHUB_REPO = 'koropati.github.io'; // Change to your repository name

// Fallback structure in case API fails
const fallbackStructure = [
    {
        name: 'blood-cell-preprocessing',
        type: 'folder',
        children: [
            { name: 'index.html', type: 'file', path: 'blood-cell-preprocessing/index.html' }
        ]
    },
    {
        name: 'image-filtering-presentation',
        type: 'folder',
        children: [
            { name: 'index.html', type: 'file', path: 'image-filtering-presentation/index.html' }
        ]
    }
];

/**
 * Fetch repository contents from GitHub API
 * @param {string} path - Path to fetch (empty for root)
 * @returns {Promise<Array>} - Promise resolving to file/folder array
 */
async function fetchGitHubContents(path = '') {
    try {
        const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${path}`;
        console.log(`Fetching: ${url}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching from GitHub API:', error);
        throw error;
    }
}

/**
 * Process a single directory to build its structure
 * @param {string} path - Current path being processed
 * @returns {Promise<Array>} - Promise resolving to structure of this directory
 */
async function processDirectory(path = '') {
    try {
        const contents = await fetchGitHubContents(path);
        const result = [];
        
        // First, collect all folders and index.html files
        for (const item of contents) {
            // Only process directories and index.html files
            if (item.type === 'dir') {
                // Process folder
                const folderPath = item.path;
                const folderName = item.name;
                
                // Recursively process this folder's contents
                const children = await processDirectory(folderPath);
                
                // Only add folders that either have index.html or have subfolders with index.html
                const hasIndexHtml = children.some(child => 
                    child.type === 'file' && child.name === 'index.html');
                
                const hasSubfoldersWithIndex = children.some(child => 
                    child.type === 'folder');
                
                if (hasIndexHtml || hasSubfoldersWithIndex) {
                    result.push({
                        name: folderName,
                        type: 'folder',
                        children: children
                    });
                }
            } 
            else if (item.type === 'file' && item.name === 'index.html') {
                // Add index.html file
                result.push({
                    name: 'index.html',
                    type: 'file',
                    path: item.path
                });
            }
        }
        
        return result;
    } catch (error) {
        console.error(`Error processing directory ${path}:`, error);
        return [];
    }
}

/**
 * Build the tree view in the DOM
 * @param {Array} items - Array of folders and files
 * @param {HTMLElement} parentElement - Parent element to append to
 */
function buildTreeView(items, parentElement) {
    items.forEach(item => {
        if (item.type === 'folder') {
            // Create folder item
            const folderDiv = document.createElement('div');
            folderDiv.className = 'tree-item';
            
            const folderSpan = document.createElement('div');
            folderSpan.className = 'tree-folder';
            folderSpan.innerHTML = `<i class="fas fa-chevron-right folder-toggle"></i><i class="fas fa-folder"></i> ${item.name}`;
            folderDiv.appendChild(folderSpan);
            
            // Create container for children
            const childrenDiv = document.createElement('div');
            childrenDiv.className = 'children';
            folderDiv.appendChild(childrenDiv);
            
            // Add to parent
            parentElement.appendChild(folderDiv);
            
            // Add event listener to toggle children
            folderSpan.addEventListener('click', () => {
                folderDiv.classList.toggle('expanded');
                const folderIcon = folderSpan.querySelector('.fas.fa-folder');
                if (folderDiv.classList.contains('expanded')) {
                    folderIcon.className = 'fas fa-folder-open';
                } else {
                    folderIcon.className = 'fas fa-folder';
                }
            });
            
            // Process children recursively
            if (item.children && item.children.length > 0) {
                buildTreeView(item.children, childrenDiv);
            }
        } else if (item.type === 'file' && item.name === 'index.html') {
            // Only display index.html files
            const fileLink = document.createElement('a');
            fileLink.className = 'tree-file';
            fileLink.href = item.path;
            fileLink.target = '_blank'; // Open in new tab
            fileLink.innerHTML = `<i class="fas fa-file-code"></i> ${item.name}`;
            
            const fileDiv = document.createElement('div');
            fileDiv.className = 'tree-item';
            fileDiv.appendChild(fileLink);
            
            parentElement.appendChild(fileDiv);
        }
    });
}

/**
 * Show a loading indicator in the tree view
 * @param {HTMLElement} element - Element to show loading in
 */
function showLoading(element) {
    element.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i> Loading repository structure...
        </div>
    `;
}

/**
 * Show an error message in the tree view
 * @param {HTMLElement} element - Element to show error in
 * @param {string} message - Error message
 */
function showError(element, message) {
    element.innerHTML = `
        <div class="error" style="color: #e53e3e; padding: 1rem;">
            <i class="fas fa-exclamation-triangle"></i> ${message}
            <p style="margin-top: 0.5rem;">Using fallback structure instead.</p>
        </div>
    `;
}

// Initialize tree when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const treeRoot = document.getElementById('repo-tree');
    
    if (!treeRoot) {
        console.error('Tree root element not found!');
        return;
    }
    
    // Show loading state
    showLoading(treeRoot);
    
    try {
        // Fetch repository structure from GitHub API
        const repoStructure = await processDirectory('');
        
        // Clear loading indicator
        treeRoot.innerHTML = '';
        
        if (repoStructure.length === 0) {
            // If structure is empty, use fallback
            console.warn('Empty repository structure returned. Using fallback.');
            buildTreeView(fallbackStructure, treeRoot);
        } else {
            // Build tree with fetched structure
            buildTreeView(repoStructure, treeRoot);
        }
    } catch (error) {
        console.error('Failed to load repository structure:', error);
        showError(treeRoot, `Failed to load repository structure: ${error.message}`);
        
        // Wait a moment before showing fallback
        setTimeout(() => {
            // Use fallback structure
            buildTreeView(fallbackStructure, treeRoot);
        }, 2000);
    }
});

// Add CSS for loading and error states
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .loading, .error {
            padding: 1rem;
            text-align: center;
            font-family: 'Segoe UI', sans-serif;
        }
        
        .loading i, .error i {
            margin-right: 0.5rem;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});
