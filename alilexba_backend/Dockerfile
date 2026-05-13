FROM mcr.microsoft.com/dotnet/sdk:8.0-bookworm-slim

WORKDIR /app

RUN dotnet tool install --global dotnet-ef --version 8.*

ENV DOTNET_USE_POLLING_FILE_WATCHER=1
ENV DOTNET_RUNNING_IN_CONTAINER=true
ENV ASPNETCORE_ENVIRONMENT=Development
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
ENV PATH="/root/.dotnet/tools:${PATH}"

EXPOSE 8080

ENTRYPOINT ["/bin/bash", "-lc", "\
set -e; \
echo '[api] Starting dotnet watch (hot reload)...'; \
exec dotnet watch run --non-interactive \
  --project \"$DOTNET_STARTUP_PROJECT\" \
  --urls \"http://0.0.0.0:8080\"; \
"]