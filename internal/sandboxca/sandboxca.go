// Package sandboxca makes the certificate authority a networked guest trusts for HTTPS.
//
// The browser can't open raw TCP connections, so the page terminates the guest's TLS itself
// (https-bridge.js), signs a certificate for each host the guest asks for, and replays the request
// with fetch(). The CA is made fresh for every build and is only ever trusted inside that guest;
// its private key ships with the site, so it must never be trusted anywhere else.
package sandboxca

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/sha1"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/json"
	"encoding/pem"
	"math/big"
	"os"
	"time"
)

// CA is a sandbox certificate authority and the leaf key the page signs certificates for.
type CA struct {
	CertPEM []byte // trusted by the guest
	Page    Page   // what the page needs to sign certificates and finish handshakes
}

// Page is written to system/tls.json. Byte slices encode as base64.
type Page struct {
	CASubject []byte `json:"caSubject"` // DER Name, the issuer of every leaf
	CAKeyID   []byte `json:"caKeyId"`   // for the leaf's authority key identifier
	CAKey     []byte `json:"caKey"`     // PKCS#8
	LeafKey   []byte `json:"leafKey"`   // PKCS#8; one key for every host
	LeafSPKI  []byte `json:"leafSpki"`  // DER SubjectPublicKeyInfo
}

// New makes a CA. Validity spans 2000-2049: a restored guest's clock is wherever the snapshot
// left it, so the certificates must not depend on the date.
func New() (*CA, error) {
	caKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		return nil, err
	}
	caPub, err := x509.MarshalPKIXPublicKey(&caKey.PublicKey)
	if err != nil {
		return nil, err
	}
	keyID := sha1.Sum(caPub)
	serial, err := rand.Int(rand.Reader, new(big.Int).Lsh(big.NewInt(1), 127))
	if err != nil {
		return nil, err
	}

	template := &x509.Certificate{
		SerialNumber:          serial,
		Subject:               pkix.Name{CommonName: "snowglobe sandbox CA (trusted only inside this guest)"},
		NotBefore:             time.Date(2000, 1, 1, 0, 0, 0, 0, time.UTC),
		NotAfter:              time.Date(2049, 12, 31, 23, 59, 59, 0, time.UTC),
		IsCA:                  true,
		BasicConstraintsValid: true,
		MaxPathLenZero:        true,
		KeyUsage:              x509.KeyUsageCertSign | x509.KeyUsageCRLSign | x509.KeyUsageDigitalSignature,
		SubjectKeyId:          keyID[:],
	}
	der, err := x509.CreateCertificate(rand.Reader, template, template, &caKey.PublicKey, caKey)
	if err != nil {
		return nil, err
	}
	cert, err := x509.ParseCertificate(der)
	if err != nil {
		return nil, err
	}

	leafKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		return nil, err
	}
	leafSPKI, err := x509.MarshalPKIXPublicKey(&leafKey.PublicKey)
	if err != nil {
		return nil, err
	}
	caPKCS8, err := x509.MarshalPKCS8PrivateKey(caKey)
	if err != nil {
		return nil, err
	}
	leafPKCS8, err := x509.MarshalPKCS8PrivateKey(leafKey)
	if err != nil {
		return nil, err
	}

	return &CA{
		CertPEM: pem.EncodeToMemory(&pem.Block{Type: "CERTIFICATE", Bytes: der}),
		Page: Page{
			CASubject: cert.RawSubject,
			CAKeyID:   cert.SubjectKeyId,
			CAKey:     caPKCS8,
			LeafKey:   leafPKCS8,
			LeafSPKI:  leafSPKI,
		},
	}, nil
}

// WritePage writes the page's half as JSON.
func (c *CA) WritePage(file string) error {
	data, err := json.Marshal(c.Page)
	if err != nil {
		return err
	}
	return os.WriteFile(file, data, 0o644)
}
