FROM python:3-buster

WORKDIR /app

COPY ./server.py ./server.py
COPY ./requirements.txt ./requirements.txt

RUN pip3 install -r requirements.txt
# todo: consider try pipenv

ENV FLASK_APP server.py
EXPOSE 5000

ENTRYPOINT [ "flask", "run", "--host=0.0.0.0" ]
