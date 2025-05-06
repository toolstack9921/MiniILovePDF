// Common JS functions to be used across all pages
document.addEventListener('DOMContentLoaded', function() {
    // Initialize any common functionality
    console.log("MiniILovePDF - Ready!");
});

// Format file size in readable format
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
