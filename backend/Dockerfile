# # pull official base image
# FROM python:3.9.4-alpine

# # set work directory
# WORKDIR /usr/src
# ENV DEBIAN_FRONTEND=noninteractive

# # set environment variables
# ENV PYTHONDONTWRITEBYTECODE 1
# ENV PYTHONUNBUFFERED 1

# # copy requirements file
# # COPY ./requirements.txt /usr/src/app/requirements.txt
# # COPY requirements.txt /usr/src/
# # copy project
# COPY . /usr/src/

# # RUN apt update && apt install -y build-essential && rm -rf /var/lib/apt/lists/*
# # RUN pip install psycopg2-binary
# # RUN pip install --upgrade pip setuptools wheel 
# # RUN pip install scikit-image numpy matplotlib more_itertools
# # RUN && pip install -r /usr/src/requirements.txt \

# # install dependencies
# RUN set -eux \
#     && apk add --no-cache --virtual .build-deps build-base \
#         libressl-dev libffi-dev gcc musl-dev python3-dev \
#         postgresql-dev bash \
#     && pip install --upgrade pip setuptools wheel \
#     && pip install -r /usr/src/requirements.txt \
#     && rm -rf /root/.cache/pip

# Use the official Ubuntu 22.04 base image
FROM ubuntu:22.04

# Set environment variables for non-interactive installation
ENV DEBIAN_FRONTEND=noninteractive

# Update package lists and install basic tools
RUN apt-get update && apt-get install -y \
    build-essential \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install Miniconda
ENV CONDA_HOME="/opt/conda"
RUN wget -qO- https://repo.anaconda.com/miniconda/Miniconda3-py39_4.10.3-Linux-x86_64.sh > miniconda.sh && \
    bash miniconda.sh -b -p $CONDA_HOME && \
    rm miniconda.sh

# Set the Conda environment as the default environment
ENV PATH="${CONDA_HOME}/bin:${PATH}"

# Create a Conda environment with Python 3.9
RUN conda create --name myenv python=3.9 && \
    echo "conda activate myenv" >> ~/.bashrc

# Activate the Conda environment
SHELL ["/bin/bash", "--login", "-c"]

# Install scikit-learn
RUN conda install -c conda-forge mapclassify
WORKDIR /usr/src/
COPY . .
RUN pip install -r requirements.txt
EXPOSE 3000

