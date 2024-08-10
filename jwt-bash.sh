#!/usr/bin/env bash

set -o pipefail

client_id="1000" # Client ID als erste Argument

project_path="$1" # Projektpfad als zweites Argument

pem=$( cat "$( dirname "${BASH_SOURCE[0]}" )/private_key.pem" ) # Dateipfad des privaten Schlüssels im Projektpfad

now=$(date +%s)
iat=$((${now} - 60)) # Ausstellungsdatum 60 Sekunden in der Vergangenheit
exp=$((${now} + 600)) # Ablaufdatum in 10 Minuten

b64enc() { openssl base64 | tr -d '=' | tr '/+' '_-' | tr -d '\n'; }

header_json='{
    "typ":"JWT",
    "alg":"RS256"
}'
# Header kodieren
header=$(echo -n "${header_json}" | b64enc )

payload_json='{
    "iat":'"${iat}"',
    "exp":'"${exp}"',
    "iss":"'"${client_id}"'" 
}'
# Payload kodieren
payload=$(echo -n "${payload_json}" | b64enc )

# Signatur
header_payload="${header}"."${payload}"
signature=$(
    openssl dgst -sha256 -sign <(echo -n "${pem}") \
    <(echo -n "${header_payload}") | b64enc
)

# JWT erstellen
JWT="${header_payload}"."${signature}"
printf '%s\n' "JWT: $JWT"

