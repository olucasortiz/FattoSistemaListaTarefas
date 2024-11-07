# Use a imagem base do OpenJDK
FROM openjdk:22-jdk-slim

# Adicione o arquivo JAR ao contêiner
COPY target/FattoBackEnd-0.0.1-SNAPSHOT.jar app.jar

# Exponha a porta que a aplicação usará
EXPOSE 8080

# Comando para executar a aplicação
ENTRYPOINT ["java", "-jar", "/app.jar"]
