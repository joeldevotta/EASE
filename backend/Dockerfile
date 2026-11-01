
FROM maven:3.9-eclipse-temurin-25 AS build

WORKDIR /app
COPY pom.xml .
COPY src ./src

RUN mvn -B clean package -DskipTests

FROM eclipse-temurin:25-jre

WORKDIR /app
COPY --from=build /app/target/ease-backend-0.1.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
