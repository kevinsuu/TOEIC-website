import pandas as pd

# 讀取Excel文件
df = pd.read_excel('./vocabulary_processed.xlsx')

# 將數據轉換為JSON格式
json_data = df.to_json(orient='records', force_ascii=False)

# 將JSON數據保存到文件
with open('vocabulary.json', 'w', encoding='utf-8') as file:
    file.write(json_data)
