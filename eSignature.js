class eSignature{
    constructor(pdf){
        this.pdf = pdf;
    }

    async sign(p12, password, reason, location){
        const P12 = await (new PKIWebSDK.Certificate()).parseP12(p12, password);
        const subject = await P12.certificate.getSubject();
        this.pdf = await new PKIWebSDK.PDF(this.pdf).sign(P12.certificate, await PKIWebSDK.Key.parsePEM(P12.privateKey, 'SHA-256'), {
            name: subject.commonName,
            reason: reason,
            location: location
        });
        return this.pdf;
    }

    download(filename){
        var a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([this.pdf]));;
        a.download = filename || 'signed.pdf';
        a.click();
    }

    async signatures(){
        return await new PKIWebSDK.PDF(this.pdf).getSignatures();
    }
}