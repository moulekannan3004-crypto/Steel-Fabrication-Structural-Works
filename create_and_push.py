import subprocess, urllib.request, json, os

repo_name = "Steel-Fabrication-Structural-Works"
description = "SteelCraft - Steel Fabrication & Structural Works Commercial Website"

# 1. Retrieve credentials
proc = subprocess.Popen(['git', 'credential', 'fill'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
out, _ = proc.communicate('protocol=https\nhost=github.com\n')
token = None
username = None
for line in out.splitlines():
    if line.startswith('password='):
        token = line.split('=', 1)[1].strip()
    elif line.startswith('username='):
        username = line.split('=', 1)[1].strip()

print(f"Creating repository '{repo_name}' for user '{username}'...")

# 2. Create repo via GitHub API
data = json.dumps({
    "name": repo_name,
    "description": description,
    "private": False,
    "has_issues": True,
    "has_projects": True,
    "has_wiki": False
}).encode('utf-8')

req = urllib.request.Request(
    'https://api.github.com/user/repos',
    data=data,
    headers={
        'Authorization': f'token {token}',
        'User-Agent': 'SteelCraft-Deployment',
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
    }
)

repo_url = None
clone_url = None
try:
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode())
        repo_url = res.get('html_url')
        clone_url = res.get('clone_url')
        print(f"Repository successfully created: {repo_url}")
except urllib.error.HTTPError as e:
    err_body = e.read().decode()
    if e.code == 422 and "already exists" in err_body:
        print(f"Repository '{repo_name}' already exists on GitHub.")
        repo_url = f"https://github.com/{username}/{repo_name}"
        clone_url = f"https://github.com/{username}/{repo_name}.git"
    else:
        print(f"HTTPError {e.code}: {err_body}")
        exit(1)
except Exception as e:
    print(f"Error: {e}")
    exit(1)

# 3. Setup git locally
def run(cmd):
    p = subprocess.run(cmd, capture_output=True, text=True)
    if p.stdout: print(p.stdout.strip())
    if p.stderr: print(p.stderr.strip())
    return p.returncode

print("Initializing git repository...")
run(['git', 'init', '-b', 'main'])
run(['git', 'config', 'user.name', username])
run(['git', 'config', 'user.email', 'moulekannan3004@gmail.com'])
run(['git', 'add', '.'])
run(['git', 'commit', '-m', 'Initial commit - SteelCraft Commercial Website'])

# Check if origin already exists
p = subprocess.run(['git', 'remote', 'get-url', 'origin'], capture_output=True, text=True)
if p.returncode == 0:
    run(['git', 'remote', 'set-url', 'origin', clone_url])
else:
    run(['git', 'remote', 'add', 'origin', clone_url])

print("Pushing to GitHub...")
ret = run(['git', 'push', '-u', 'origin', 'main', '--force'])
if ret == 0:
    print(f"SUCCESS: Pushed code to {repo_url}")
else:
    print("Push failed!")
