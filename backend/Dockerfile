FROM python:3.9-slim

WORKDIR /backend

COPY requirements*.txt ./
RUN pip install -r requirements.prod.txt

COPY ./RestAPI ./RestAPI
COPY runserver.py .


ENV SERVER_HOST=0.0.0.0
ENV SERVER_PORT=3000
ENV DB_HOST=localhost
ENV DB_PORT=5432
ENV DB_NAME=ligfinder
ENV DB_USER=postgres
ENV DB_PASSWORD=postgres

EXPOSE 3000
CMD [ "gunicorn", "runserver:app", "-w 2", "-b 0.0.0.0:3000"]