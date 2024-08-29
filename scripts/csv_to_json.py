import csv
import json

def csv_to_json(csv_file_path, json_file_path):
    data = {}
    current_word_id = None

    with open(csv_file_path, 'r', encoding='utf-8') as csv_file:
        csv_reader = csv.reader(csv_file)
        headers = next(csv_reader)  # Leer los encabezados

        for row in csv_reader:
            if row[0] and row[1]:  # Si tiene wordID y word, es una nueva entrada
                current_word_id = int(row[0]) - 1 
                word = row[1]
                if current_word_id not in data:
                    data[current_word_id] = {
                        "wordID": current_word_id,
                        "word": word,
                        "meanings": []
                    }
                
                context = row[2]
                words = [word for word in row[3:] if word]
                
                data[current_word_id]["meanings"].append({
                    "context": context,
                    "words": words
                })
            else:  # Si no tiene wordID y word, es información adicional para la entrada anterior
                context = row[2]
                words = [word for word in row[3:] if word]
                
                data[current_word_id]["meanings"].append({
                    "context": context,
                    "words": words
                })

    result = list(data.values())

    with open(json_file_path, 'w', encoding='utf-8') as json_file:
        json.dump(result, json_file, ensure_ascii=False, indent=2)

# Uso del script
csv_file_path = 'input.csv'  # Reemplaza con la ruta de tu archivo CSV
json_file_path = 'output.json'  # Reemplaza con la ruta donde quieres guardar el JSON

csv_to_json(csv_file_path, json_file_path)
print(f"El archivo JSON ha sido creado en: {json_file_path}")