ESM Manager
==========================

This web application allows you to create configuration files for ESM questionnaires, to be used with the ESM Flexible Plugin of AWARE Framework. The application provides secure access and a dashboard to manage all your questionnaires, creation, edition and deletion.

The questionnaires are composed by general settings, questions and scheduled. The output is a XML file that can be retrieved by the aforementioned plugin.

Docker container structure
==========================
The app is deployed using the Flask framework, and a Docker service structure. The project includes 3 services:
- **webserver**: Nginx webserver, Flask framework and web application
- **mysql**: secure MySQL database with no access from outside
- **phpmyadmin**: database manager with web-based interface
