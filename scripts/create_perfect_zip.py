import os
import zipfile
import shutil

def create_archive():
    target_zip = 'nexusplay-gaming-platform.zip'
    desktop_zip = r'C:\Users\gopiv\Desktop\nexusplay-gaming-platform.zip'
    
    exclude_dirs = {'node_modules', 'dist', 'build', '.temp', '.cache', 'coverage'}
    exclude_files = {target_zip, 'zip_helper.ps1'}

    print("[Zip Engine] Packaging NexusPlay platform with full .git repository history...")

    file_count = 0
    git_file_count = 0

    with zipfile.ZipFile(target_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk('.'):
            rel_root = os.path.relpath(root, '.')
            dirs[:] = [d for d in dirs if d not in exclude_dirs]

            for file in files:
                if file in exclude_files or file.endswith('.zip'):
                    continue
                
                full_path = os.path.join(root, file)
                if rel_root == '.':
                    arcname = file
                else:
                    arcname = os.path.join(rel_root, file).replace('\\', '/')
                
                zipf.write(full_path, arcname)
                file_count += 1
                if arcname.startswith('.git/'):
                    git_file_count += 1

    size_mb = os.path.getsize(target_zip) / (1024 * 1024)
    print(f"[OK] Created {target_zip}: Total files: {file_count} (including {git_file_count} .git files, size: {size_mb:.2f} MB)")

    shutil.copyfile(target_zip, desktop_zip)
    print(f"[OK] Copied to Desktop: {desktop_zip}")

    with zipfile.ZipFile(target_zip, 'r') as verify_zip:
        namelist = verify_zip.namelist()
        has_git_head = '.git/HEAD' in namelist
        has_package_json = 'package.json' in namelist
        print(f"[Verification] .git/HEAD: {has_git_head}, package.json: {has_package_json}")

if __name__ == '__main__':
    create_archive()
