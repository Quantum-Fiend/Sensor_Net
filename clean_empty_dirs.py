import os

root_dir = r"c:\Users\tusha\OneDrive\Desktop\Sensor_Net"

def remove_empty_dirs(path):
    if not os.path.isdir(path):
        return

    # Remove empty subfolders
    files = os.listdir(path)
    if len(files):
        for f in files:
            fullpath = os.path.join(path, f)
            if os.path.isdir(fullpath):
                remove_empty_dirs(fullpath)

    # If folder is empty now, delete it
    files = os.listdir(path)
    if len(files) == 0:
        print(f"Removing empty directory: {path}")
        os.rmdir(path)

if __name__ == "__main__":
    remove_empty_dirs(root_dir)
