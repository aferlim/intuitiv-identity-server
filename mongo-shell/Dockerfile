FROM alpine

RUN apk upgrade --update

RUN apk add --no-cache mongodb

COPY . /

RUN chmod +x /export.sh

CMD ["sh", "/export.sh"]