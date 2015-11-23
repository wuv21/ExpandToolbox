import json

def method1():
    with open('city.list.us.json', 'rb') as file:
        data = file.read().decode('utf-8').split('\n')

        compressed = []
        for city in data:
            city_list = city.split(',')

            try:
                city_id = int(city_list[0][7:])
                city_name = city_list[1][7:].replace('"', '')
                city_country = city_list[2][11:].replace('"', '')
                
                compressed.append({'id': city_id,
                                   'name': city_name,
                                   'cc': city_country})
            except Exception as e:
                print(e)


    with open('city_compressed_us.json', 'w') as file:
        json_file = json.dumps(compressed)
        file.write(json_file)
        
method1()
