

from flask import Flask, render_template, request, json
from pm25 import get_pm25, get_six_pm25, get_countys, get_county_pm25

app = Flask(__name__)


@app.route('/')
@app.route('/<name>')
def index(name='GUEST'):
    return render_template('./index.html', name=name, date=getdate())


@app.route('/date')
def getdate():
    from datetime import datetime
    date = datetime.now()

    return date.strftime('%Y-%m-%d %H:%M:%S')


@app.route('/bmi/name=<name>&height=<height>&weight=<weight>')
def get_bmi(name, height, weight):
    try:
        bmi = round(eval(weight)/(eval(height)/100)**2, 2)
        return f'{name} BMI:{bmi}'
    except Exception as e:
        return '參數錯誤'


@app.route('/stock')
def getstock():
    stocks = [
        {'分類': '日經指數', '指數': '22,920.30'},
        {'分類': '韓國綜合', '指數': '2,304.59'},
        {'分類': '香港恆生', '指數': '25,083.71'},
        {'分類': '上海綜合', '指數': '3,380.68'}
    ]
    return render_template('./stock.html', stocks=stocks, date=getdate())


sort = False


@app.route('/pm25', methods=['GET', 'POST'])
def pm25():
    global sort
    if request.method == 'POST':
        sort = not sort

    date = getdate()
    columns, values = get_pm25(sort)
    return render_template('./pm2.5.html', **locals())


@app.route('/pm25-charts')
def pm25_charts():

    return render_template('./pm25-charts-bulma.html', countys=get_countys())


@app.route('/pm25-json', methods=['POST'])
def pm25_json():
    columns, values = get_pm25()
    site = [value[1] for value in values]
    pm25 = [value[2] for value in values]
    date = values[0][-1]

    return json.dumps({'date': date, 'site': site, 'pm25': pm25}, ensure_ascii=False)


@app.route('/pm25-six-json', methods=['POST'])
def pm25_six_json():
    values = get_six_pm25()
    site = [value[0] for value in values]
    pm25 = [value[1] for value in values]
    date = values[0][-1]
    return json.dumps({'site': site, 'pm25': pm25}, ensure_ascii=False)


@app.route('/pm25-county/<county>', methods=['POST'])
def pm25_county_json(county):
    try:
        values = get_county_pm25(county)
        site = [value[0] for value in values]
        pm25 = [value[1] for value in values]
        return json.dumps({'site': site, 'pm25': pm25}, ensure_ascii=False)
    except:
        return "取得資料失敗"


if __name__ == '__main__':

    app.run(debug=True)
