def convert_pdf_to_word(pdf_path, docx_path):
    """
    Convert PDF to Word document using pdf2docx library
    
    Args:
        pdf_path (str): Path to the input PDF file
        docx_path (str): Path to save the output Word document
        
    Returns:
        bool: True if conversion was successful, False otherwise
    """
    try:
        # Import pdf2docx here to avoid requiring it for the entire application
        from pdf2docx import Converter
        
        # Convert PDF to Word
        cv = Converter(pdf_path)
        cv.convert(docx_path)
        cv.close()
        
        return True
    except Exception as e:
        print(f"Error converting PDF to Word: {e}")
        return False
