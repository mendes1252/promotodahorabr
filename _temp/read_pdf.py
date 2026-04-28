import PyPDF2
import sys

def read_pdf(file_path):
    with open(file_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page in reader.pages:
            text += page.extract_text() + '\n'
        with open('output.txt', 'w', encoding='utf-8') as out_file:
            out_file.write(text)

if __name__ == "__main__":
    read_pdf('PRD — promotodahoraBR Portal.pdf')
