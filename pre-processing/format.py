import json

# Load the JSON data from the file
with open('vocabulary.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Function to remove spaces from Chinese translations
def remove_spaces_from_chinese(text):
    return text.replace(' ', '')

# Clean the data
for entry in data:
    entry['Chinese'] = remove_spaces_from_chinese(entry['Chinese'])

# Save the cleaned data back to a new JSON file
with open('cleaned_vocabulary.json', 'w', encoding='utf-8') as file:
    json.dump(data, file, ensure_ascii=False, indent=4)

print("Cleaned data saved to 'cleaned_vocabulary.json'")
