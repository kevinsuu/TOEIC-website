import pandas as pd
import re

# Load the Excel file
file_path = '/mnt/data/vocabulary.xlsx'
df = pd.read_excel(file_path, sheet_name='Sheet1')

# Initialize an empty DataFrame to store the results
result_df = pd.DataFrame(columns=df.columns)

# Define a regular expression pattern to match numbers followed by a period and space
pattern = re.compile(r'(\d+\.\s.*?)(?=\d+\.\s|$)')

# Iterate over each row in the DataFrame
for index, row in df.iterrows():
    chinese_text = row['Chinese']
    # Check if the Chinese text contains multiple parts
    if pd.notnull(chinese_text):
        matches = pattern.findall(chinese_text)
        if matches:
            # First, add the original row without the matches
            cleaned_chinese_text = pattern.sub('', chinese_text).strip()
            if cleaned_chinese_text:
                original_row = row.copy()
                original_row['Chinese'] = cleaned_chinese_text
                result_df = result_df.append(original_row, ignore_index=True)
            # Add new rows for each match
            for match in matches:
                # Split the match into parts
                match_parts = re.split(r'\s+', match.strip(), 2)
                if len(match_parts) == 3:
                    new_row = pd.Series({
                        'ID': match_parts[0].rstrip('.'),
                        'English': match_parts[1],
                        'Part of Speech': match_parts[2].split(' ')[0],
                        'Chinese': match_parts[2].split(' ', 1)[1]
                    })
                    result_df = result_df.append(new_row, ignore_index=True)
        else:
            result_df = result_df.append(row, ignore_index=True)
    else:
        result_df = result_df.append(row, ignore_index=True)

# Save the result to a new Excel file
output_path = '/mnt/data/vocabulary_processed.xlsx'
result_df.to_excel(output_path, index=False)

output_path
