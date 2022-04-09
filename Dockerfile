FROM hayd/alpine-deno:latest
WORKDIR /app

# These steps will be re-run upon each file change in your working directory:
COPY . ./

## Precache all dependencies
RUN ["deno" , "cache", "src/deps.ts"]

# Added to ENTRYPOINT of base image.
CMD ["run", "--allow-env", "--allow-net", "src/index.ts"]