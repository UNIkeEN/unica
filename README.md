# Unica

Unica is a tiny, open-source team project management tool, born from code practice.

## 🚧 Features

- [x] Freely create organizations, manage invitations and permissions
- [ ] Create projects for individuals or organizations, supporting real-time collaboration
  - [ ] Kanban boards to manage tasks within projects
  - [ ] Knowledge base to document everything related to the project
- [x] Organization-level discussion feature

## Getting Started

### Clone

```bash
git clone git@github.com:UNIkeEN/unica.git
```

### Frontend

The frontend uses React, NextJS with Typescript. Please make sure you have `node>=20`.

```bash
cd frontend
npm install
```

To launch a development server, use

```bash
npm run dev
```

To launch a production server, use

```bash
npm run build
npm run start
```

### Backend

The backend uses the Python-based Django framework. Install the necessary package first.

```bash
cd backend
pip install -r requirements.txt
```

To initialize the database, please use

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser # Create admin user
```

To launch a development server, use

```bash
python manage.py runserver
```

To launch the production environment server, please use Gunicorn or another suitable server.
