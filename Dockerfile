FROM semtech/mu-javascript-template
WORKDIR /app

COPY . /app

# Set environment variables
ENV NODE_ENV=development

EXPOSE 80

CMD ["npm", "start"]
