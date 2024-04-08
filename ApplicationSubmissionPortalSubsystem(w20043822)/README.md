# ApplicationSubmissionPortalSubsystem
## W20043822 Harry Ardern
This is the final implementation of my groupwork subsystem

Specifically, the participant sign-up subsystem which utilises an Open AI pipeline to streamline the process

# Set up
1. Firstly clone this repository and cd into this directory.

2. Create a python virtual environment the using virtualenv command.
: You can install virtualenv with python -m pip install --user virtualenv

3. Once your virtual environment has been created activate it by either running '.venv/Scripts/activate' on Windows, or "source venv/Bin/activate on Mac and Linux".

4. Next install the requirement using "pip install -r requirements.tx"t"

5. Finally run "python ./managy.py runserver" to start the web server 

### Considerations
This project is semi-reliant on the OpenAI python API this API uses an authentication key to securely pass data between the application and the OpenAI servers however OpenAI policy prevents these API keys from being shared and if stored within this repository will cause it to be closed by OpenAI. Due to this, the API key used in this system has been removed, however, if a key is required the function to pass it to has been commented and if needed I can provide another key via non-git hub means. However, the version of this code submitted in the zip file does have the API key stored.
