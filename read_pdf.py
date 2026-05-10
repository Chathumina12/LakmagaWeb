import sys
from pypdf import PdfReader

try:
    reader = PdfReader("Assigement/Final Project & MG (2026).pdf")
    text = ""
    for i, page in enumerate(reader.pages):
        text += f"--- Page {i+1} ---\n"
        text += page.extract_text() + "\n"
    
    with open("pdf_content.txt", "w", encoding="utf-8") as f:
        f.write(text)
    print(f"Extracted {len(reader.pages)} pages to pdf_content.txt")
except Exception as e:
    print(f"Error: {e}")
