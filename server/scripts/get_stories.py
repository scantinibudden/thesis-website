import os

def get_stories(folder_path):
    stories = {}

    for file_name in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file_name)
    
        if os.path.isfile(file_path):  # Check if it's a file
            stories[file_name.lower()] = get_story(file_path)
    
    return stories

    
def get_story(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    return content.split()