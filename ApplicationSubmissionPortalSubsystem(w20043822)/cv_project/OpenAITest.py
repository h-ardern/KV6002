import io
from openai import OpenAI
# Set the key first
# Had to be removed due to openAI policy regarding api Keys being stored in
client = OpenAI(api_key='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')
from pdfminer.converter import TextConverter
from pdfminer.pdfinterp import PDFPageInterpreter, PDFResourceManager
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage

def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as fh:
        for page in PDFPage.get_pages(fh, caching=True, check_extractable=True):
            resource_manager = PDFResourceManager()
            fake_file_handle = io.StringIO()
            converter = TextConverter(resource_manager, fake_file_handle, laparams=LAParams())
            page_interpreter = PDFPageInterpreter(resource_manager, converter)
            page_interpreter.process_page(page)
            text = fake_file_handle.getvalue()
            converter.close()
            fake_file_handle.close()
            if text:
                return text

def extract_cv_info(cv_text):
    response = client.chat.completions.create(model="gpt-3.5-turbo",
                                            messages=[
                                                {"role": "system", "content": "You are a helpful assistant."},
                                                {"role": "user", "content": f"{cv_text}"},
                                                {"role": "assistant",
                                                 "content": "Extract the subbmiters first name , last name , email , address, age and gender details from the above text returning the results in a python dictionary with no description , just the dictionary."},
                                            ])

    return response.choices[0].message.content

cv_path = 'media/cvs/Henry Ardern CV 2023.pdf'  # adjust path
cv_text = extract_text_from_pdf(cv_path)
info = extract_cv_info(cv_text)
print(info)
