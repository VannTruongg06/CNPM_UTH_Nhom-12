# PROJECT HANDOVER & SETUP (DOCKER)

Follow these 3 Steps:

### Step 1: Environment Setup
The recipient's machine is required to have:

1.  Docker Desktop (Installed and running).
2.  Git (Optional but recommended).

### Step 2: System Launch

1.  Extract the project folder.
2.  Open Terminal (PowerShell or CMD) in that folder.
3.  Run the single command below to build the entire Server, Database, and Web:

    docker-compose up --build -d

    (Wait about 3-5 minutes for the first run to download and install everything).

### Step 3: Data Seeding (First run only)
Since this is a new machine, the Database will be empty. Run these 3 commands sequentially in the Terminal to import the Menu and create an Admin:

1.  Create Tables & Dining Tables:
    1. docker-compose exec backend python manage.py migrate
    2. docker-compose exec backend python create_tables.py

2.  Import Food Menu:
    docker-compose exec backend python import_menu.py

3.  Create Admin Account (Manager):
    docker-compose exec backend python manage.py createsuperuser

    (Enter any Username/Password you prefer).

---

### HOW TO USE
After completing Step 3, you can access the system immediately:

- Guest Page: http://localhost (online reservation page).
- Login Page (Admin): http://localhost/login -> log in with the created admin account.
- Staff Page: after creating a Staff account inside Admin -> return to login page http://localhost/login and log in with the created staff account.
