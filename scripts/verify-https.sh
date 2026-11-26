#!/usr/bin/env bash
# Public Pages acceptance: GitHub's HTTPS enforcement must actually be enabled.
# A valid certificate alone is insufficient: HTTP must redirect to HTTPS.
set -euo pipefail

BASE_URL="https://wiki.oreki.net"
REPOSITORY="${GITHUB_REPOSITORY:-OrekiDawson/AD-Oreki-Wiki}"
: "${GH_TOKEN:?GH_TOKEN must be provided with at least GitHub Pages read permission}"

echo "Checking Pages custom domain and enforced HTTPS for ${REPOSITORY}"
pages="$(gh api "repos/${REPOSITORY}/pages" --jq '[.cname, (.https_enforced|tostring), (.https_certificate.state // "unknown")] | @tsv')"
IFS=$'\t' read -r cname enforced cert_state <<< "$pages"
echo "custom_domain=${cname}; https_enforced=${enforced}; certificate_state=${cert_state}"

[[ "$cname" == "wiki.oreki.net" ]] || {
  echo "::error::The GitHub Pages custom domain must be wiki.oreki.net (actual: ${cname})"
  exit 1
}
[[ "$enforced" == "true" ]] || {
  echo "::error::HTTPS is NOT enforced. Enable Settings > Pages > Enforce HTTPS after the certificate is ready."
  exit 1
}

# TLS verification is intentionally enabled; no -k, no --insecure, no HTTP fallback.
for path in "/" "/index.html" "/static/contentIndex.json" "/player/" "/developer/" "/developer/architecture/kotlin-runtime" "/wiki-rules" "/copyright" "/antimatter-dimensions"; do
  echo "Checking TLS and HTTP 200: ${BASE_URL}${path}"
  code="$(curl --fail --silent --show-error --max-time 30 --output /dev/null --write-out '%{http_code}' "${BASE_URL}${path}")" || {
    echo "::error::HTTPS endpoint failed (including certificate validation): ${BASE_URL}${path}"
    exit 1
  }
  [[ "$code" == "200" ]] || { echo "::error::Expected HTTPS 200 for ${path}, got ${code}"; exit 1; }
done

home="$(mktemp)"
headers="$(mktemp)"
trap 'rm -f "$home" "$headers"' EXIT
curl --fail --silent --show-error --max-time 30 --output "$home" "${BASE_URL}/"
grep -Fq "CC BY-SA 4.0" "$home" || {
  echo "::error::HTTPS homepage missing CC BY-SA 4.0 license notice"
  exit 1
}
grep -Fq "反物质维度 MOD Wiki" "$home" || {
  echo "::error::HTTPS homepage is missing the expected site title"
  exit 1
}

# Never follow the first HTTP response: verify the enforced redirect itself.
http_code="$(curl --silent --show-error --max-time 30 --output /dev/null --dump-header "$headers" --write-out '%{http_code}' 'http://wiki.oreki.net/')"
case "$http_code" in
  301|302|307|308) ;;
  *) echo "::error::HTTP must redirect to HTTPS, got status ${http_code}"; exit 1 ;;
esac
location="$(awk 'BEGIN{IGNORECASE=1} tolower($1)=="location:"{gsub(/\r/,""); print $2}' "$headers" | tail -n 1)"
[[ "$location" =~ ^https://wiki[.]oreki[.]net(/|$|[?\#]) ]] || {
  echo "::error::HTTP redirect must target https://wiki.oreki.net, got: ${location:-<missing>}"
  exit 1
}

echo "PASS: Pages https_enforced=true, HTTPS TLS and content valid, HTTP redirects to HTTPS"

