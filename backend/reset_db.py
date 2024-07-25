import os
import glob
import subprocess

def delete_files(directory, pattern):
    files = glob.glob(os.path.join(directory, pattern))
    for file in files:
        if os.path.basename(file) != "__init__.py":
            try:
                os.remove(file)
                print(f"Deleted: {file}")
            except OSError as e:
                print(f"Error deleting {file}: {e}")

def main():
    directories = ["api/migrations/", "oauth/migrations/"]
    for directory in directories:
        delete_files(directory, "*.py")

    db_file = "./db.sqlite3"
    if os.path.exists(db_file):
        try:
            os.remove(db_file)
            print(f"Deleted: {db_file}")
        except OSError as e:
            print(f"Error deleting {db_file}: {e}")
    else:
        print(f"{db_file} does not exist")

    subprocess.run(["python", "manage.py", "makemigrations"])
    subprocess.run(["python", "manage.py", "migrate"])

if __name__ == "__main__":
    main()
