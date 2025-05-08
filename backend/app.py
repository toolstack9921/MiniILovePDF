from flask import Flask, request, jsonify, send_file, after_this_request
from werkzeug.utils import secure_filename
import os
import uuid
import time
from tools.pdf_converter import convert_pdf_to_word

app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['OUTPUT_FOLDER'] = 'outputs'
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB max file size

# Ensure upload and output directories exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['OUTPUT_FOLDER'], exist_ok=True)

# Enable CORS
# In app.py - Make sure the CORS headers are correctly configured

@app.after_request
def after_request(response):
    # Allow requests from your Netlify domain
    allowed_origins = [
        'http://localhost:8080',  # Development
        'https://gleeful-kitsune-50052e.netlify.app'  # Production (update this later)

    ]
    
    origin = request.headers.get('Origin')
    if origin in allowed_origins:
        response.headers.add('Access-Control-Allow-Origin', origin)
    
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    return response


@app.route('/api/convert/pdf-to-word', methods=['POST'])
def pdf_to_word():
    # Check if file was uploaded
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    # Check if file is empty
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Validate file type
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({'error': 'File must be a PDF'}), 400
    
    try:
        # Generate unique filename
        filename = str(uuid.uuid4()) + '.pdf'
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Save uploaded file
        file.save(filepath)
        
        # Generate output filename
        output_filename = str(uuid.uuid4()) + '.docx'
        output_filepath = os.path.join(app.config['OUTPUT_FOLDER'], output_filename)
        
        # Convert PDF to Word
        success = convert_pdf_to_word(filepath, output_filepath)
        
        if not success:
            return jsonify({'error': 'Conversion failed'}), 500
        
        # Return download URL
        download_url = f"/download/{output_filename}"
        
        return jsonify({
            'success': True,
            'downloadUrl': download_url,
            'filename': os.path.splitext(file.filename)[0] + '.docx'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download/<filename>', methods=['GET'])
def download_file(filename):
    filepath = os.path.join(app.config['OUTPUT_FOLDER'], filename)
    
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404
    
    # Get original filename from request
    original_filename = request.args.get('name', 'converted.docx')
    
    @after_this_request
    def cleanup(response):
        # Delete file after sending (optional)
        try:
            # Uncomment to enable auto-cleanup after download
            # os.remove(filepath)
            pass
        except:
            pass
        return response
    
    return send_file(
        filepath, 
        as_attachment=True,
        download_name=original_filename,
        mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )

if __name__ == '__main__':
    app.run(debug=True)
