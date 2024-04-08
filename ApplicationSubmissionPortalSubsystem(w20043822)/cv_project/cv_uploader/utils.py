import os

from pdfminer.pdfpage import PDFPage
from openai import OpenAI
import io
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter

def extract_text_from_pdf(pdf_path):
    text = ""  # This will hold the entire text of the PDF
    with open(pdf_path, 'rb') as fh:
        for page in PDFPage.get_pages(fh, caching=True, check_extractable=True):
            resource_manager = PDFResourceManager()
            fake_file_handle = io.StringIO()
            converter = TextConverter(resource_manager, fake_file_handle, laparams=LAParams())
            page_interpreter = PDFPageInterpreter(resource_manager, converter)
            page_interpreter.process_page(page)

            # Concatenate all the page text into one string
            text += fake_file_handle.getvalue()
            converter.close()
            fake_file_handle.close()

    if text:
        print('PDF Extraction Complete ')
        os.remove(pdf_path)  # Deletes the PDF file to preserve security
    return text

def extract_cv_info(cv_text):
    client = OpenAI(api_key='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')
    response = client.chat.completions.create(model="gpt-3.5-turbo",
                                              messages=[
                                                  {"role": "system", "content": "You are a helpful assistant."},
                                                  {"role": "user", "content": f"{cv_text}"},
                                                  {"role": "assistant",
                                                   "content": "Extract the submitters first name, last name, email, address, age(in years), and gender details from the above text, returning the results in a Python dictionary with no description, just the dictionary."},
                                              ])

    return response.choices[0].message.content