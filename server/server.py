from flask import Flask, jsonify
from flask_cors import cross_origin, CORS
from pymongo import MongoClient
from datetime import datetime


app = Flask(__name__)

client = MongoClient(
    "mongodb+srv://admin:1234@poscoict-internship-tea.pjwph.mongodb.net/test?authSource=admin&replicaSet=atlas-x4q3t7-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true")
db = client.get_database('test')


@app.route('/api', methods=['GET'])
@cross_origin()
def root():
    db.hits.insert_one({'time': datetime.utcnow()})
    response = jsonify(
        message='This page has been visited {} times.'.format(db.hits.count()))
    return response


if __name__ == '__main__':
    # only used locally
    app.run(host='0.0.0.0', port=5000, debug=True)
