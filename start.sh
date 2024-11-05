docker-compose down

docker build -t backend-tarefas:latest ./FattoBackEnd

docker build -t frontend-tarefas:latest ./FattoFrontEnd

docker-compose up --build --force-recreate --remove-orphans