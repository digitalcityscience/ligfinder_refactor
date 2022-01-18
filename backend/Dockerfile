FROM python:3.9.9-alpine

WORKDIR /usr/src/app

COPY . .

RUN pip install Pipfile

EXPOSE 3000
CMD [ "python", "./runserver.py"]