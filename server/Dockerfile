FROM python:3.6-alpine
# FROM ubuntu:20.04
RUN apk --no-cache add --virtual .builddeps gcc gfortran musl-dev     && pip install numpy==1.14.0     && apk del .builddeps     && rm -rf /root/.cache

WORKDIR /server
# Install python dependencies
RUN pip install --upgrade pip

COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY server.py ./

EXPOSE 5000

CMD python server.py
