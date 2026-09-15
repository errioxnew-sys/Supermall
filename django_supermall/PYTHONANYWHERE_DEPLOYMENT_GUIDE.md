# Deploying SuperMall Malawi to PythonAnywhere (Step-by-Step Guide)

Follow this quick guide to deploy your Django SuperMall application on [PythonAnywhere](https://www.pythonanywhere.com/).

---

## 1. Upload & Extract the Project

1. Log in to your **PythonAnywhere** dashboard.
2. Go to the **Files** tab.
3. In the directory `/home/<your-username>/`, click **"Upload a file"** and choose `supermall_django.zip`.
4. Open a **Bash Console** from your PythonAnywhere dashboard.
5. In the Bash console, run:
   ```bash
   unzip supermall_django.zip
   ```
   *(Or if it extracts into `django_supermall`, make sure you know the path, e.g. `/home/<your-username>/django_supermall`)*

---

## 2. Create and Setup a Python 3.10 Virtualenv

In your PythonAnywhere Bash console, run:

```bash
# Create a virtual environment using virtualenvwrapper
mkvirtualenv --python=/usr/bin/python3.10 supermall-venv

# Navigate to the project directory
cd ~/django_supermall

# Install required packages
pip install -r requirements.txt
```

---

## 3. Run Migrations, Seed Data, and Collect Static Files

While still inside `~/django_supermall` with the virtualenv active (`(supermall-venv)` prompt):

```bash
# Generate database schema and apply migrations
python manage.py makemigrations mall
python manage.py migrate

# Seed Malawi flagship stores, inventory, and categories
python manage.py seed_mall

# Collect static files into the staticfiles directory
python manage.py collectstatic --noinput

# (Optional) Create an admin superuser for the backend console
python manage.py createsuperuser
```

---

## 4. Configure the Web App in PythonAnywhere

1. Go to the **Web** tab on PythonAnywhere.
2. Click **"Add a new web app"**.
3. Choose **Manual configuration** (do **NOT** select the Django wizard).
4. Select **Python 3.10**.
5. Once created, scroll down on the **Web** tab to configure:

### A. Virtualenv Path
In the **Virtualenv** section, enter:
```
/home/<your-username>/.virtualenvs/supermall-venv
```
*(Replace `<your-username>` with your actual PythonAnywhere username)*

### B. Code Directory
In the **Code** section:
- **Source code**: `/home/<your-username>/django_supermall`
- **Working directory**: `/home/<your-username>/django_supermall`

### C. Static & Media Files Mapping
In the **Static files** section of the Web tab, add these two entries:
1. **Static Assets**:
   - **URL**: `/static/`
   - **Directory**: `/home/<your-username>/django_supermall/staticfiles`
2. **User Uploaded Media (Photos & Gallery)**:
   - **URL**: `/media/`
   - **Directory**: `/home/<your-username>/django_supermall/media`

---

## 5. Configure the WSGI File

1. On the **Web** tab, click the link next to **WSGI configuration file** (e.g., `/var/www/<your-username>_pythonanywhere_com_wsgi.py`).
2. Delete everything currently inside that file, and paste the following snippet:

```python
import os
import sys

# Path to your Django project directory
path = '/home/<your-username>/django_supermall'
if path not in sys.path:
    sys.path.insert(0, path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'supermall.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```
*(Make sure to replace `<your-username>` with your actual PythonAnywhere username!)*

3. Click the green **Save** button in the top right.

---

## 6. Reload & Visit Your App!

1. Go back to the **Web** tab.
2. Click the big green **"Reload <your-username>.pythonanywhere.com"** button.
3. Open `https://<your-username>.pythonanywhere.com/` in your browser!

Your SuperMall Malawi portal is now live with:
- Store Directory & Search (`/explore/`)
- Merchant mini-sites (`/s/zikomo-boutique/`, `/s/nyika-coffee/`, `/s/flamingo-spa/`)
- Shopping Bag & Mobile Money checkouts
- Merchant Staff Portals (`/dashboard/zikomo-boutique/`)
- SuperMall Admin Console (`/super-admin/`)
