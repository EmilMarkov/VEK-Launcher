from playwright.sync_api import sync_playwright 
import re
import os
from dotenv import load_dotenv, set_key

url = "https://rawg.io/games" 

def extract_key_from_url(url):
    match = re.search(r'key=([\w]+)', url)
    if match:
        return match.group(1)
    return None

load_dotenv()

def update_env_key(new_key):
    env_path = '../.env'
    if os.path.exists(env_path):
        set_key(env_path, 'VEK_API_KEY', new_key)
        print(env_path + " | Перезаписал ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    else:
        with open(env_path, 'w') as env_file:
            env_file.write(f'VEK_API_KEY={new_key}\n')
            print(env_path + " | Записал ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

with sync_playwright() as p: 
    def handle_response(response):
        if "key=" in response.url:
            key = extract_key_from_url(response.url)
            if key:
                update_env_key(key)
                print(f"API Key updated in .env: {key}")

    browser = p.chromium.launch() 
    page = browser.new_page() 
    
    page.on("response", handle_response) 
    page.goto(url, wait_until="networkidle", timeout=90000)
    
    page.context.close() 
    browser.close()
