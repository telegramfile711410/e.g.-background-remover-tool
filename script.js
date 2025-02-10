const fileInput = document.getElementById('fileInput');
const uploadBtn = document.querySelector('.upload-btn');
const beforeImage = document.getElementById('beforeImage');
const afterImage = document.getElementById('afterImage');
const progressBar = document.querySelector('.progress');
const downloadBtn = document.getElementById('downloadBtn');

// Handle file upload
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    processImage(file);
  }
});

// Drag & Drop functionality
document.addEventListener('dragover', (e) => {
  e.preventDefault();
});

document.addEventListener('drop', (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) {
    processImage(file);
  }
});

// Process image using ClipDrop API
async function processImage(file) {
  const formData = new FormData();
  formData.append('image_file', file);

  // Show before image
  const reader = new FileReader();
  reader.onload = (e) => {
    beforeImage.src = e.target.result;
  };
  reader.readAsDataURL(file);

  // Show progress bar
  progressBar.style.width = '50%';

  try {
    const response = await fetch('https://clipdrop-api.co/remove-background/v1', {
      method: 'POST',
      headers: {
        'x-api-key': 'YOUR_CLIPDROP_API_KEY', // Replace with your ClipDrop API key
      },
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to remove background');

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // Show after image
    afterImage.src = url;
    progressBar.style.width = '100%';

    // Enable download button
    downloadBtn.disabled = false;
    downloadBtn.addEventListener('click', () => {
      const a = document.createElement('a');
      a.href = url;
      a.download = 'background-removed.png';
      a.click();
    });
  } catch (error) {
    console.error(error);
    alert('Error removing background. Please try again.');
    progressBar.style.width = '0';
  }
}