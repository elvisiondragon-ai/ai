import os
import re

# Precise mappings
precise_replacements = {
    'AGUS_WA.mp4': 'https://www.youtube.com/shorts/kVgfxHX_GeY',
    'DRVIDEO_WA.mp4': 'https://www.youtube.com/shorts/U6NsL9RL9rY',
    'HABIBVIDEO_WA.mp4': 'https://www.youtube.com/shorts/jD6XlkCL4sI',
    'UMIVIDEO_WA.mp4': 'https://www.youtube.com/shorts/1ZNFxjPdFr8',
    'FELVIDEO_WA.mp4': 'https://www.youtube.com/shorts/Rs_UDalr8q8',
    'LENA_WA.mp4': 'https://www.youtube.com/shorts/-9u7v6vT5ds',
    'VIOVIDEO_WA.mp4': 'https://www.youtube.com/shorts/cPwGC0NW8s4',
    'arif_inte.mp4': 'https://www.youtube.com/shorts/9L28-k3FAig',
    'el_vsl1.mp4': 'https://www.youtube.com/shorts/wQv7mHlE-5o',
    'ugc1_id.mp4': 'https://www.youtube.com/shorts/-xsxQ6cUP7M',
    'ugc2_id.mp4': 'https://www.youtube.com/shorts/-xsxQ6cUP7M',
    'habib.mp4': 'https://www.youtube.com/shorts/jD6XlkCL4sI',
    'vio.mp4': 'https://www.youtube.com/shorts/cPwGC0NW8s4',
    'dr.mp4': 'https://www.youtube.com/shorts/U6NsL9RL9rY',
    'arif1.mp4': 'https://www.youtube.com/shorts/9L28-k3FAig',
    'arif2.mp4': 'https://www.youtube.com/shorts/9L28-k3FAig'
}

def replace_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Generic replacement for any supabase mp4 that matches our filename list
    # The URL pattern is usually https://[...].supabase.co/storage/v1/object/public/[...]/[filename]
    
    supabase_pattern = r'https://[a-z0-9]+\.supabase\.co/storage/v1/object/public/[^"\'\s)]+\.mp4'
    
    def match_replace(match):
        url = match.group(0)
        filename = url.split('/')[-1]
        if filename in precise_replacements:
            return precise_replacements[filename]
        # Fallback if we don't know the file but it's a supabase mp4?
        # Maybe use the "How our mind effect our health" as a safe fallback?
        # User said "change ALL video mp4 that coming from supabase to youtube"
        return "https://www.youtube.com/shorts/-xsxQ6cUP7M"

    content = re.sub(supabase_pattern, match_replace, content)
    
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

exclude_dirs = {'usa', 'sg', 'node_modules', '.git', 'dist'}

for root, dirs, files in os.walk('src'):
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            path = os.path.join(root, file)
            if replace_in_file(path):
                print(f"Updated {path}")
