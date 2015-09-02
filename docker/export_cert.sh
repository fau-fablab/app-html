KEYSTORE=$1

if [ -z "$KEYSTORE" ]; then
	echo Please specify path to keystore
	exit 1;
fi

if [ -z "$FABLAB_KEYSTORE_PASSWORD" ]; then
	echo Please specify password for keystore in \$FABLAB_KEYSTORE_PASSWORD
	exit 1;
fi

TMPKEYSTORE=/tmp/fab_pkcs12.p12
CRTALIAS=selfsigned

# convert keystore
keytool -importkeystore -srckeystore $KEYSTORE -srcstorepass "$FABLAB_KEYSTORE_PASSWORD" -destkeystore $TMPKEYSTORE -deststoretype PKCS12 -srcalias $CRTALIAS -deststorepass "$FABLAB_KEYSTORE_PASSWORD" -destkeypass "$FABLAB_KEYSTORE_PASSWORD"

# export public cert
openssl pkcs12 -in $TMPKEYSTORE -nokeys -out fablab_html_cert.pem -passin env:FABLAB_KEYSTORE_PASSWORD

#export private cert
openssl pkcs12 -in $TMPKEYSTORE -nodes -nocerts -out fablab_html_key.pem -passin env:FABLAB_KEYSTORE_PASSWORD

rm $TMPKEYSTORE
