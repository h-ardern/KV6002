from django.contrib import messages
from django.core.files.storage import default_storage
import sqlite3
from .forms import PDFUploadForm
from django.shortcuts import render, redirect
from django.conf import settings
import os
from .utils import extract_text_from_pdf, extract_cv_info
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password


def home(request):
    # View to render the home page and the initial CV upload form.
    form = PDFUploadForm()
    return render(request, 'cv_uploader/upload_form.html', {'form': form})


def upload_and_process_cv(request):
    if request.method == 'POST':
        form = PDFUploadForm(request.POST, request.FILES)
        if form.is_valid():
            uploaded_file = request.FILES['file']
            file_path = default_storage.save('cvs/' + uploaded_file.name, uploaded_file)
            full_file_path = os.path.join(settings.MEDIA_ROOT, file_path)

            cv_text = extract_text_from_pdf(full_file_path)
            info = extract_cv_info(cv_text)
            try:
                info = eval(info)
            except:
                info = {}
            print('Upload and Process is running')
            return render(request, 'cv_uploader/custom_form.html', info)
        else:
            messages.error(request, 'Invalid form submission. Please check your inputs.')
    else:
        return render(request, 'cv_uploader/upload_form.html')

    return redirect('home')


def check_email(request):
    email = request.POST.get('email')
    database_dir = (str(settings.BASE_DIR) + '/cv_uploader/users.sqlite')
    print(database_dir)
    conn = sqlite3.connect(database_dir)
    c = conn.cursor()
    c.execute("SELECT * FROM Users WHERE email=?", (email,))
    data = c.fetchall()
    if len(data) == 0:
        conn.close()
        return JsonResponse({'email_exists': False})
    else:
        conn.close()
        return JsonResponse({'email_exists': True})

def check_username(request):
    username = request.GET.get('username')
    database_dir = (str(settings.BASE_DIR) + '/cv_uploader/users.sqlite')
    conn = sqlite3.connect(database_dir)
    c = conn.cursor()
    c.execute("SELECT * FROM Users WHERE username=?", (username,))
    data = c.fetchall()
    if len(data) == 0:
        conn.close()
        return JsonResponse({'username_exists': False})
    else:
        conn.close()
        return JsonResponse({'username_exists': True})


def create_user_with_interests(request):
    if request.method == 'POST':
        # Extract and validate data from the request
        username = request.POST.get('username')
        password = request.POST.get('password1')
        firstname = request.POST.get('first_name')
        lastname = request.POST.get('last_name')
        email = request.POST.get('email')
        address = request.POST.get('address')
        age = request.POST.get('age')
        gender_id = request.POST.get('gender')
        interest_ids = request.POST.getlist('interest')

        # Hash the password
        hashed_password = make_password(password)

        # Path to your database
        db_path = (str(settings.BASE_DIR) + '/cv_uploader/users.sqlite')

        try:
            # Open a new database connection
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()

                # Insert the new user using parameterized queries for protection
                cursor.execute("""
                    INSERT INTO users (username, password, usertypeID, firstname, lastname, email, address, age, genderID)
                    VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?)
                """, (username, hashed_password, firstname, lastname, email, address, age, gender_id))
                user_id = cursor.lastrowid

                # Insert the user's interests
                for interest_id in interest_ids:
                    cursor.execute("""
                        INSERT INTO participantinterests (userID, interestID)
                        VALUES (?, ?)
                    """, (user_id, interest_id))

                # The connection and cursor are automatically closed upon exiting the 'with' block

            # On successful user creation, return a success response
            return JsonResponse({
                "status": "success",
                "message": "User successfully created!",
            })

        except sqlite3.IntegrityError as e:
            # Handle any integrity errors, e.g., duplicate usernames
            print(e)
            return JsonResponse({
                "status": "error",
                "message": "IntegrityError: " + str(e),
            })

        except sqlite3.Error as e:
            # Handle general SQLite errors
            print(e)
            return JsonResponse({
                "status": "error",
                "message": "SQLite Error: " + str(e),
            })

    else:
        # If not a POST request, indicate that the method is not allowed
        return JsonResponse({
            "status": "error",
            "message": "This endpoint only supports POST requests.",
            "redirect_url": "/"
        }, status=405)

