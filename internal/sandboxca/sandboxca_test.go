package sandboxca

import (
	"bytes"
	"crypto/x509"
	"encoding/pem"
	"testing"
)

func TestNew(t *testing.T) {
	ca, err := New()
	if err != nil {
		t.Fatal(err)
	}
	block, _ := pem.Decode(ca.CertPEM)
	cert, err := x509.ParseCertificate(block.Bytes)
	if err != nil {
		t.Fatal(err)
	}
	if !cert.IsCA || cert.MaxPathLen != 0 || !cert.MaxPathLenZero {
		t.Error("should be a CA that can only sign leaves")
	}
	// The page builds leaves from these, so they must agree with the certificate the guest trusts
	if !bytes.Equal(ca.Page.CASubject, cert.RawSubject) || !bytes.Equal(ca.Page.CAKeyID, cert.SubjectKeyId) {
		t.Error("page issuer fields don't match the CA certificate")
	}
	if _, err := x509.ParsePKCS8PrivateKey(ca.Page.CAKey); err != nil {
		t.Error(err)
	}
	if _, err := x509.ParsePKCS8PrivateKey(ca.Page.LeafKey); err != nil {
		t.Error(err)
	}
	if _, err := x509.ParsePKIXPublicKey(ca.Page.LeafSPKI); err != nil {
		t.Error(err)
	}
}
