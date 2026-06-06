"""
save_version.py — backup cijelog projekta u versions/ folder
Koristiti: python3 save_version.py "naziv_backupa"
"""
import shutil, os, sys, datetime

def save_version(label):
    src = os.path.dirname(os.path.abspath(__file__))
    versions_dir = os.path.join(src, '..', 'BAC_versions')
    os.makedirs(versions_dir, exist_ok=True)
    date = datetime.date.today().isoformat()
    dst = os.path.join(versions_dir, f"{date}_{label}")
    shutil.copytree(src, dst, ignore=shutil.ignore_patterns(
        'versions', 'BAC_versions', '__pycache__', '.git', 'node_modules'
    ))
    print(f"Saved: {dst}")

if __name__ == '__main__':
    label = sys.argv[1] if len(sys.argv) > 1 else 'backup'
    save_version(label)
