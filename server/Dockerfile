FROM python:3.6-slim

#RUN apk --no-cache add --virtual .builddeps gcc gfortran musl-dev     && pip install numpy==1.14.0    && apk del .builddeps     && rm -rf /root/.cache

WORKDIR /server
# Install python dependencies
RUN pip install --upgrade pip
RUN apt-get update 
RUN apt-get -y install libgl1-mesa-glx
RUN apt-get -y install libglib2.0-0


COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY server.py ./

EXPOSE 5000

CMD python server.py
