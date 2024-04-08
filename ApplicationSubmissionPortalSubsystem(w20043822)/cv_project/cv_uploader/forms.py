from django import forms


class PDFUploadForm(forms.Form):
    file = forms.FileField(
        label='Upload CV',
        help_text='Max. 42 megabytes. PDF format only.',
        widget=forms.FileInput(attrs={
            'accept': 'application/pdf',  # Only accept PDF files
            'class': 'form-control'  # Bootstrap class for styling
        }),
        required=True
    )
class ReviewInformationForm(forms.Form):
    fname = forms.CharField(max_length=100, required=False)
    lname = forms.CharField(max_length=100, required=False)
    address = forms.CharField(max_length=15000, required=False)
    email = forms.EmailField(required=False)
    Age = forms.IntegerField(required=False)
    gender = forms.IntegerField(required=False)
    interests = forms.MultipleChoiceField()