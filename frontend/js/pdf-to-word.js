document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const selectFileBtn = document.getElementById('selectFileBtn');
    const removeFileBtn = document.getElementById('removeFileBtn');
    const convertBtn = document.getElementById('convertBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const convertAnotherBtn = document.getElementById('convertAnotherBtn');
    const fileDetails = document.getElementById('fileDetails');
    const conversionProgress = document.getElementById('conversionProgress');
    const downloadArea = document.getElementById('downloadArea');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const progressFill = document.getElementById('progressFill');
    const statusText = document.getElementById('statusText');
    
    // Track selected file
    let selectedFile = null;
    let downloadUrl = null;
    
    // Handle file selection via button
    selectFileBtn.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Handle file input change
    fileInput.addEventListener('change', handleFileSelect);
    
    // Handle drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files);
        }
    });
    
    // Remove selected file
    removeFileBtn.addEventListener('click', () => {
        resetToUploadState();
    });
    
    // Convert file
    convertBtn.addEventListener('click', () => {
        if (!selectedFile) return;
        
        // Show conversion progress
        fileDetails.style.display = 'none';
        conversionProgress.style.display = 'block';
        
        // Simulate progress (in a real app, this would update based on backend response)
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            progressFill.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    conversionProgress.style.display = 'none';
                    downloadArea.style.display = 'block';
                    
                    // In a real app, the backend would return the URL to download
                    // For this demo, we're just simulating the conversion
                    downloadUrl = '#'; // This would be a real URL from the backend
                }, 500);
            }
        }, 300);
        
        // In a real application, this is where you'd make an API call to your backend
        uploadFileToServer(selectedFile);
    });
    
    // Download converted file
    downloadBtn.addEventListener('click', () => {
        if (!downloadUrl) return;
        
        // For local development, prefixed with backend URL
        const fullDownloadUrl = `${apiConfig.apiBaseUrl}${downloadUrl}`;
        
        // In a production environment, you'd use the full URL
        window.location.href = fullDownloadUrl;
        
    });
    
    // Convert another file
    convertAnotherBtn.addEventListener('click', () => {
        resetToUploadState();
    });
    
    // Handle selected files
    function handleFileSelect(e) {
        const files = e.target.files;
        handleFiles(files);
    }
    
    function handleFiles(files) {
        if (files.length === 0) return;
        
        const file = files[0];
        
        // Check if file is a PDF
        if (file.type !== 'application/pdf') {
            alert('Please select a PDF file.');
            return;
        }
        
        // Check file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size exceeds 10MB limit.');
            return;
        }
        
        selectedFile = file;
        
        // Display file details
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        
        // Show file details section
        dropZone.style.display = 'none';
        fileDetails.style.display = 'block';
    }
    
    // Reset UI to initial state
    function resetToUploadState() {
        selectedFile = null;
        downloadUrl = null;
        fileInput.value = '';
        
        dropZone.style.display = 'block';
        fileDetails.style.display = 'none';
        conversionProgress.style.display = 'none';
        downloadArea.style.display = 'none';
        
        progressFill.style.width = '0%';
    }
    
    // Upload file to server (in a real app)
    // In pdf-to-word.js - Update the uploadFileToServer function

function uploadFileToServer(file) {
    // Show conversion progress UI
    fileDetails.style.display = 'none';
    conversionProgress.style.display = 'block';
    statusText.textContent = 'Uploading file...';

    const formData = new FormData();
    formData.append('file', file);

    const backendUrl = apiConfig.apiBaseUrl + '/convert/pdf-to-word';

    // Simulated progress
    let progress = 0;
    const interval = setInterval(() => {
        if (progress < 90) {
            progress += 10;
            progressFill.style.width = `${progress}%`;

            if (progress < 40) {
                statusText.textContent = 'Uploading file...';
            } else if (progress < 80) {
                statusText.textContent = 'Converting PDF to Word...';
            }
        }
    }, 300);

    fetch(backendUrl, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        return response.blob();
    })
    .then(blob => {
        clearInterval(interval);
        progressFill.style.width = '100%';
        statusText.textContent = 'Conversion complete! Preparing download...';

        // Create download link and simulate click
        const downloadLink = document.createElement("a");
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = file.name.replace('.pdf', '.docx');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Show download complete UI
        setTimeout(() => {
            conversionProgress.style.display = 'none';
            downloadArea.style.display = 'block';
        }, 500);
    })
    .catch(error => {
        clearInterval(interval);
        console.error('Error:', error);
        statusText.textContent = 'Error: ' + error.message;
        progressFill.style.width = '0%';

        alert('An error occurred during conversion. Please try again.');

        setTimeout(() => {
            resetToUploadState();
        }, 2000);
    });
}


});
