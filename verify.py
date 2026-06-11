import subprocess
import os

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
screenshot_path = r"C:\Users\Akshay\.gemini\antigravity-ide\brain\f4295f02-7de8-4716-81c1-ff7e165ba346\screenshot.png"
cmd = [chrome_path, "--headless=new", "--window-size=1280,1024", f"--screenshot={screenshot_path}", "http://127.0.0.1:8000"]

print("Running command:", " ".join(cmd))
res = subprocess.run(cmd, capture_output=True, text=True)

print("Exit code:", res.returncode)
print("Stdout:", res.stdout)
print("Stderr:", res.stderr)

if os.path.exists(screenshot_path):
    print("SUCCESS: screenshot.png created!")
else:
    print("FAILURE: screenshot.png NOT created!")
