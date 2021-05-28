class eSignature{
    constructor(pdf){
        this.pdf = pdf;
    }

    /**
     * Signs the PDF with a certificate
     * @param {Object} info - The information of the signature
     * @param {Date} info.date - the date the signing took place 
     * @param {String} info.reason - the reason the document was signed
     * @param {String} info.location - the place the document was signed
     * @param {String} info.contactInfo - the contact information about the signer
     * @param {Number} info.page - The page where the signature will be located
     * @param {Number} info.x - The x-axis of the coordinate where the signature will be located within the page
     * @param {Number} info.y - The y-axis of the coordinate where the signature will be located within the page
     * @param {Number} info.width - The width of the image
     * @param {Number} info.height - The height of the image
     * @param {Uint8Array} info.image - The visual image of the signature as a JPEG stream
     */

    async sign(p12, password, info){
        const P12 = await (new PKIWebSDK.Certificate()).parseP12(p12, password);
        const subject = await P12.certificate.getSubject();

        info.name = subject.commonName;
        info.date = info.date || new Date();

        this.pdf = await new PKIWebSDK.PDF(this.pdf).sign(P12.certificate, await PKIWebSDK.Key.parsePEM(P12.privateKey, 'SHA-256'), info);

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
