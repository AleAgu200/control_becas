import json
import random
from datetime import datetime
from dateutil.relativedelta import relativedelta
from datetime import timedelta


# Load the data
with open('MOCK_DATA (1).json') as f:
    data = json.load(f)
for item in data:
    day_of_year = random.randint(1, 365)

    # Change the "inicio" date to a random date in 2023
    inicio_date = datetime(2023, 1, 1) + timedelta(days=day_of_year - 1)
    item['inicio'] = inicio_date.isoformat()
    # Calculate the "final" date by adding 12 months to the "inicio" date
    final_date = inicio_date + relativedelta(months=12)
    item['final'] = final_date.isoformat()

# Generate SQL
columns = ', '.join(data[0].keys())
values = ', '.join(f"({', '.join(f'''{json.dumps(v)}''' for v in item.values())})" for item in data)
sql = f'INSERT INTO table_name ({columns}) VALUES {values};'

# Print SQL
with open('inserts.sql', 'w') as f:
    f.write(sql)
