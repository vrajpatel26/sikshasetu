import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateCertificate = async (req, res) => {

  try {

    const { studentName, courseName } = req.body;

    const doc = new PDFDocument({
      layout: "landscape",
      size: "A4",
      margin: 50
    });

    const fileName = `${studentName}-${courseName}-certificate.pdf`;
    const filePath = path.join("public/certificates", fileName);

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);


    /* BACKGROUND */
    doc.rect(0, 0, doc.page.width, doc.page.height)
       .fill("#f5f8ff");

    doc.fillColor("black");


    /* OUTER BORDER */
    doc
      .lineWidth(6)
      .strokeColor("#2c7be5")
      .rect(30, 30, doc.page.width - 60, doc.page.height - 60)
      .stroke();


    /* INNER BORDER */
    doc
      .lineWidth(1)
      .strokeColor("#7aa7ff")
      .rect(50, 50, doc.page.width - 100, doc.page.height - 100)
      .stroke();


    /* TITLE */
    doc
      .fontSize(42)
      .fillColor("#1a1a1a")
      .text("CERTIFICATE OF COMPLETION", 0, 180, {
        align: "center"
      });


    /* SUBTITLE */
    doc
      .fontSize(20)
      .fillColor("#555")
      .text("This certificate is proudly presented to", 0, 260, {
        align: "center"
      });


    /* STUDENT NAME */
    doc
      .fontSize(36)
      .fillColor("#000")
      .text(studentName.toUpperCase(), 0, 320, {
        align: "center"
      });


    /* DESCRIPTION */
    doc
      .fontSize(20)
      .fillColor("#444")
      .text("for successfully completing the course", 0, 380, {
        align: "center"
      });


    /* COURSE NAME */
    doc
      .fontSize(30)
      .fillColor("#2c7be5")
      .text(courseName, 0, 440, {
        align: "center"
      });


    /* FOOTER */
    doc
      .fontSize(16)
      .fillColor("#555")
      .text("Issued by SikshaSetu", 0, 520, {
        align: "center"
      });


    doc.end();


    stream.on("finish", () => {

      res.json({
        success: true,
        file: `/certificates/${fileName}`
      });

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Certificate generation failed"
    });

  }

};