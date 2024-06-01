import pandas as pd
import pdfplumber
import re

def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text()
    return text

def parse_vocabulary(text):
    lines = text.split('\n')
    vocabulary_list = []
    pattern = re.compile(r'^(\d+)\.\s+([a-zA-Z\s]+)\s+([a-z]+)\s+(.+)$')
    current_entry = {}

    for line in lines:
        line = line.strip()
        if line:
            match = pattern.match(line)
            if match:
                if current_entry:
                    vocabulary_list.append(current_entry)
                current_entry = {
                    'ID': match.group(1).strip(),
                    'English': match.group(2).strip(),
                    'Part of Speech': match.group(3).strip(),
                    'Chinese': match.group(4).strip()
                }
            else:
                # Handle multi-line translations
                if current_entry and not re.match(r'^\d+\.', line):
                    current_entry['Chinese'] += ' ' + line
    if current_entry:
        vocabulary_list.append(current_entry)
    
    return vocabulary_list

def save_to_excel(vocabulary_list, excel_path):
    df = pd.DataFrame(vocabulary_list)
    df.to_excel(excel_path, index=False, encoding='utf-8')

pdf_path = './mnt/data/全新制多益TOEIC必考單字3000.pdf'
excel_path = './mnt/data/vocabulary.xlsx'

text = extract_text_from_pdf(pdf_path)
vocabulary_list = parse_vocabulary(text)
save_to_excel(vocabulary_list, excel_path)

print(f'Vocabulary extracted and saved to {excel_path}')
