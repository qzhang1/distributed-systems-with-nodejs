# delete node_modules
find . -type d -name node_modules -prune -exec rm -rf '{}' +

# delete generated keys
find . \( -name "*.cert" -o -name "*.key" \) -exec rm '{}' +