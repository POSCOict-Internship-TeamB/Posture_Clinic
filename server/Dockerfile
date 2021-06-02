FROM python:3.6-alpine
# FROM ubuntu:20.04

WORKDIR /server

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY server.py ./

EXPOSE 5000

CMD python server.py
