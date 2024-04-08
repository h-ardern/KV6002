# ApplicationSubmissionPortalSubsystem
## W20043822 Harry Ardern
This is the final implementation of my groupwork subsystem

Specifically the participant sign up subsystem which utilises an Open AI pipeline to streamline the process

# Set up
1. Firstly clone this repository and cd into this directory.

2. Create a python virtual enviroment the using virtualenv command.
: You can install virtualenv with python -m pip install --user virtualenv

3. Once your virtual environment has been created activate it by either running '.venv/Scrits/activate' on windows , or "source venv/Bin/activate on mac and linux".

4. Next install the requirement using "pip install -r requirements.tx"t"

5. Finally run "python ./managy.py runserver" to start the web server 

### Considerations
1. Firstly, this project is semi-reliant on the OpenAI python API this API uses authentication key to securely pass data between the application and the OpenAI servers however OpenAI policy prevent these API key from being shared and if stored within this repository will cause it to closed by OpenAI. Due to this the API key used in this system has been removed , however if a key is required the function to pass it to has been clearly commented and if needed I can provide another key via non git hub means. However the version of this code submitted in the zip file does have the APIkey stored.
