// Define repository structure
// This should be replaced with actual folder structure
const repoStructure = [
    {
        name: 'blood-cell-preprocessing',
        type: 'folder',
        children: [
            { name: 'index.html', type: 'file', path: 'blood-cell-preprocessing/index.html' },
            { name: 'script.js', type: 'file', path: 'blood-cell-preprocessing/script.js' },
            { name: 'styles.css', type: 'file', path: 'blood-cell-preprocessing/styles.css' },
            { name: 'assets', type: 'folder', children: [
                { name: 'image1.jpg', type: 'file', path: 'blood-cell-preprocessing/assets/image1.jpg' },
                { name: 'image2.jpg', type: 'file', path: 'blood-cell-preprocessing/assets/image2.jpg' }
            ]}
        ]
    },
    {
        name: 'image-filtering-presentation',
        type: 'folder',
        children: [
            { name: 'index.html', type: 'file', path: 'image-filtering-presentation/index.html' },
            { name: 'explain.html', type: 'file', path: 'image-filtering-presentation/explain.html' }
        ]
    },
    {
        name: 'computer-vision-project',
        type: 'folder',
        children: [
            { name: 'index.html', type: 'file', path: 'computer-vision-project/index.html' },
            { name: 'documentation', type: 'folder', children: [
                { name: 'index.html', type: 'file', path: 'computer-vision-project/documentation/index.html' }
            ]}
        ]
    }
];

// Function to build tree view
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

// Function to auto-scan the directory structure (Note: this is a placeholder since client-side JS can't scan directories)
// In a real implementation, you would need to generate this data server-side or manually maintain it
function fetchDirectoryStructure() {
    // In a real implementation, you could fetch this data from an API endpoint
    // For now, we'll use the hardcoded repoStructure
    return Promise.resolve(repoStructure);
}

// Initialize tree
document.addEventListener('DOMContentLoaded', async () => {
    const treeRoot = document.getElementById('repo-tree');
    
    try {
        // In a real implementation, this would fetch the structure
        const structure = await fetchDirectoryStructure();
        buildTreeView(structure, treeRoot);
    } catch (error) {
        console.error('Error loading directory structure:', error);
        treeRoot.innerHTML = `<div class="error">Error loading directory structure. ${error.message}</div>`;
    }
});
