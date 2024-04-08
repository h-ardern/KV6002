Patrick Shaw
w20012045

usernames and passwords:

user1 : password1
user2 : password2
user3 : password3
user4 : password4
user5 : password5

Merged details:

Subsystem frontends successfully merged:

DashboardSubSystem(w19013579
Dynamic-Search(w21034262)
SignInSubSystem(w20012045)
StudyUploadSubsystem(w20013299)

Separate frontend not merged:

ApplicationSubmissionPortalSubsystem(w20043822)

Subsystem Backends successfully merged:

Dynamic-Search(w21034262)
SignInSubSystem(w20012045)

Subsystem frontends partial failure merged:


1. Dynamic-Search(w21034262)
2. SignInSubSystem(w20012045)
3. StudyUploadSubsystem(w20013299)
4. DashboardSubSystem(w19013579)

1 and 2 are fully merged, but 3 and 4 encountered errors. unfortunately with them the original group member's backends had to be called

Separate Backend not merged:

ApplicationSubmissionPortalSubsystem(w20043822)

Part 1 backend:



Endpoints:



1. Endpoint 1: token

https://w20012045.nuwebspace.co.uk/kv6002/merged/api/token

https://w20012045.nuwebspace.co.uk/kv6002/merged/api/token/

Endpoint 1 parameters:

Username and Password are transmitted via authorization headers




2. Endpoint 2: CreateAccount

https://w20012045.nuwebspace.co.uk/kv6002/signinsubsystem/api/createaccount

https://w20012045.nuwebspace.co.uk/kv6002/signinsubsystem/api/createaccount

Endpoint 2 parameters:

All relevant fields must be inputted and must be inputted in the correct format

data must be inputted like this in the body of the request as raw JSON data

{
"username": "user20",
"password": "password8",
"usertypeID": 1,
"firstname": "John",
"lastname": "Doe",
"email": "user20@example.com",
"address": "123, Street, City, Country",
"age": 19,
"genderID": 1
}

3. Endpoint 3: UserData

https://w20012045.nuwebspace.co.uk/kv6002/merged/api/userdata

https://w20012045.nuwebspace.co.uk/kv6002/merged/api/userdata/

Endpoint 3 parameters:

a valid token must authorized to get the specific user data linked to that token



4. Endpoint 4: country

https://w20012045.nuwebspace.co.uk/kv6002/merged/api/country

https://w20012045.nuwebspace.co.uk/kv6002/merged/api/country/

Endpoint 4 parameters:

No parameters



5. Endpoint 5: interests

https://w20012045.nuwebspace.co.uk/kv6002/merged/api/interests

https://w20012045.nuwebspace.co.uk/kv6002/merged/api/interests/

Endpoint 5 parameters:

1. Get: a valid token must authorized to get the specific user's interest linked to that token via imbedded userID within
2. Post: a valid token must authorized to get the post user interests, linked to that token via imbedded userID within

data must be inputted like this in the body of the request as raw JSON data

{
        "interestID": 4
}



6. Endpoint 6: developer

https://w20012045.nuwebspace.co.uk/kv6002/merged/api

https://w20012045.nuwebspace.co.uk/kv6002/merged/api/

https://w20012045.nuwebspace.co.uk/kv6002/merged/api/developer

Endpoint 4 parameters:

No parameters


Part 2 frontend:



1. Landing page (home page):

https://w20012045.nuwebspace.co.uk/kv6002/merged/app/

Notable considerations:

this is the landing page of the website other pages can be accessed via the menu and browser router of the code and functionality of the website.







