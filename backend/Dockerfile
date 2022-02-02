FROM python:3.9

WORKDIR /backend

COPY requirements*.txt ./
RUN pip install -r requirements.prod.txt

COPY ./RestAPI ./RestAPI
COPY runserver.py .

EXPOSE 3000
CMD [ "gunicorn", "runserver:app", "-w 2", "-b 0.0.0.0:3000"]