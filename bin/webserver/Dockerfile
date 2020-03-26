# Starting from image with python, nginx and flask installed
FROM tiangolo/uwsgi-nginx-flask:python3.7

# Working directory
WORKDIR /app

# Application
COPY app .

# Install utils
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		nano software-properties-common \
	&& rm -rf /var/lib/apt/lists/*

# Python dependencies
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# SSL certificates
COPY data/private /data
RUN cp /data/*.crt /data/*.key /etc/ssl/

