FROM python:3.8-slim

RUN pip install jsonschema

COPY validate.py /validate.py
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
