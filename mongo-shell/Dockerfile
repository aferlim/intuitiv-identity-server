FROM alpine
RUN apk add --no-cache mongodb -t
COPY . /
RUN chmod +x /export.sh
CMD ["sh", "/export.sh"]