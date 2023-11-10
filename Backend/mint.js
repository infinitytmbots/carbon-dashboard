module.exports = {
    pinFileToIPFS: function(credit){
        return pinFileToIPFS(credit);
    }
}

const pinFileToIPFS = async (credit) => {
    const FormData = require("form-data");
    const axios = require("axios");
    const fs = require("fs");
    const { createCanvas, loadImage } = require("canvas");
    const JWT = `Bearer TOKEN`;
    const canvas = createCanvas(506, 304);
    const context = canvas.getContext("2d");
    const image = await loadImage("template.png");
    var text = credit;
    context.drawImage(image, 0, 0, 506, 304);
    context.fillStyle = "#fff";
    context.font = "bold 60pt Menlo";
    context.fillText(text, 305, 160);
    var currentdate = new Date();
    text =
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear();
    context.fillStyle = "#fff";
    context.font = "medium 15pt Menlo";
    context.fillText(text, 100, 240);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync("./output.png", buffer);

    const formData = new FormData();
    const src = "./output.png";

    const file = fs.createReadStream(src);
    formData.append("file", file);

    const metadata = JSON.stringify({
        name: "File name",
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
        cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    try {
        const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
            maxBodyLength: "Infinity",
            headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: JWT,
            },
        }
        );
        return(res.data.IpfsHash);
    } catch (error) {
        console.log(
        "======================================================================="
        );
        console.log(error);
    }
};
