![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)
![WebStorm](https://img.shields.io/badge/webstorm-143?style=for-the-badge&logo=webstorm&logoColor=white&color=black)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![GitLab](https://img.shields.io/badge/gitlab-%23181717.svg?style=for-the-badge&logo=gitlab&logoColor=white)
---

## The project "EK-Blog" enables authors to write, edit and publish their articles.

#### [Link to the project](https://ek-blog.herokuapp.com/) on Heroku
___
###  Part I To start the project to local:
##### 1. Rename .env.dist file to .env
##### 2. $ `npm install`
##### 3. $ `npm run migration:run`
##### 4. $ `npm run start:dev`

---
### Part II To start the project using the docker container:
##### 1. Rename .env.dist file to .env
##### 2. in file .env uncomment section --Postgers Docker-- and comment --Postgers local--.
##### 3. in docker-compose.yml change ports to 5433:5432.
##### 4. $ `npm install`
##### 5. $ `docker-compose up`
##### 6. $ `npm run migration:run`
##### 7. $ `npm run start:dev` or `npm run start:prod`

___
### Part III To deploy the project on Heroku [link](https://www.heroku.com)
##### 1. Create a new app on Heroku
##### 2. In the project tab on Heroku "overview" install the add-on Heroku-Postgres
##### 3. In the project tab on Heroku "overview" install the add-on Heroku-Redis
##### 4. Create the Procfile in your project root directory and paste the following line into it: $ web: npm run start:prod
##### 5. Follow the steps to deploy the project to Heroku in the "Deploy" tab
##### 6. In the Heroku app go to the "settings" tab of the project, 
##### click on the button "Reveal Config Vars" 
##### add the following keys and values ​​to the fields:
###### DATABASE_URL: we take in the project on Heroku, tab resources, Heroku Postgres, settings, button View Credentials, copy the entire URI line 
###### TYPEORM_CONNECTION: postgres
###### TYPEORM_URL: we take in the project on Heroku, tab resources, Heroku Postgres, settings, button View Credentials, copy the entire URI line
###### TYPEORM_PORT: 5432
###### JWT_SECRET: heroku
###### JWT_EXPIRES_IN: 1000d
###### TYPEORM_DRIVER_EXTRA: {"ssl":true}
###### NODE_TLS_REJECT_UNAUTHORIZED: 0
###### SMTP_HOST=smtp.gmail.com
###### SMTP_PORT=465
###### SMTP_SUPPORT_EMAIL=ek.space.01@gmail.com
###### SMTP_SUPPORT_PASSWORD=generate a password following this instruction [link](https://myaccount.google.com/apppasswords?rapt=AEjHL4O1wd7XSYNdlLGhJuqEdtlFFnAapKsjqE6roW-wxR4QNcTbqn1nCVINXUUZlkSry2WiHVZ2ATrbBlr19jRlFuf2eR0Wpw)
###### BASE_URL=https://ek-blog.herokuapp.com
###### REDIS_HOST=ec2-52-211-224-65.eu-west-1.compute.amazonaws.com
###### REDIS_PORT=14510
###### REDIS_PASSWORD=we take in the project on Heroku, tab resources, Heroku Redis, settings, button View Credentials, copy the entire password line
###### REDIS_URL=we take in the project on Heroku, tab resources, Heroku Redis, settings, button View Credentials, copy the entire URI line
___
##### 7. Add migrations to Postgres on Heroku: 
##### $ `npm run migration:run`
##### 8. Run the command $ `git push heroku master`
