# Fetching a specific version of python docker image
FROM python:3.12.0-slim-bullseye

ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install dependencies:
COPY requirements.txt .
RUN pip install -r requirements.txt

# Run the application:
COPY main.py .
CMD ["python", "main.py"]


