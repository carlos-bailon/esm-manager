# Start from phomyadmin image
FROM phpmyadmin/phpmyadmin

# Copy the data to workdir
COPY data/ ./

# SSL certificates
RUN a2enmod ssl \
	&& cp private/*.crt private/*.key /etc/apache2 \
    && cp private/default-ssl-phpmyadmin.conf /etc/apache2/sites-enabled/default-ssl.conf
