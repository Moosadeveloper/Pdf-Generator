async function generateStylishPDF() {
  const { jsPDF } = window.jspdf;
  const pdfHeight = 250; // Increased height to accommodate more details
  const pdf = new jsPDF({
    unit: "mm",
    format: [210, pdfHeight],
  });

  const form = document.querySelector("form");

  // Check if the form is valid
  if (!form.checkValidity()) {
    form.reportValidity(); // Highlight the errors
    alert("Form is invalid. Please fill all required fields.");
    return; // Stop execution if the form is invalid
  }

  alert("Form is valid. Generating PDF...");

  // Collect form data
  const name = document.getElementById("name").value;
  const fatherName = document.getElementById("fatherName").value;
  const dob = document.getElementById("dob").value;
  const age = document.getElementById("age").value;
  const cnic = document.getElementById("cnic").value;
  const qualification = document.getElementById("qualification").value;
  const motherTongue = document.getElementById("motherTongue").value;
  const parentsContact = document.getElementById("parentsContact").value;
  const address = document.getElementById("address").value;
  const course = document.getElementById("course").value;
  const phone = document.getElementById("phone").value;
  const profilePic = document.getElementById("profilePic").files[0];

  const logoImage = "auj-re.png";
  const bgImage = "bag.jpg";
  const footerImage = "endd.png";

  const addProfilePicture = (callback) => {
    if (!profilePic) {
      callback(null); // Pass null if no profile picture is uploaded
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const imgData = e.target.result;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const size = 200;
      canvas.width = size;
      canvas.height = size;

      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      const image = new Image();
      image.onload = function () {
        ctx.drawImage(image, 0, 0, size, size);
        const circularImgData = canvas.toDataURL("image/png");
        callback(circularImgData);
      };

      image.src = imgData;
    };

    reader.readAsDataURL(profilePic);
  };

  addProfilePicture(function (profileImg) {
    const bg = new Image();
    bg.onload = function () {
      pdf.addImage(bg.src, "JPEG", 0, 0, 210, 70);

      const logo = new Image();
      logo.onload = function () {
        pdf.addImage(logo.src, "PNG", 10, 35, 60, 40);

        // Add circular profile picture if it exists
        if (profileImg) {
          pdf.addImage(profileImg, "PNG", 85, 40, 55, 55);
        }

        // Add details in two-column format
        const fields = [
          { label1: "Name", value1: name, label2: "Father Name", value2: fatherName },
          { label1: "Date of Birth", value1: dob, label2: "Age", value2: age },
          { label1: "B.FORM No", value1: cnic, label2: "Qualification", value2: qualification },
          { label1: "M. Tongue", value1: motherTongue, label2: "Parent's No", value2: parentsContact },
          { label1: "Address", value1: address, label2: "Course", value2: course },
          { label1: "Phone No", value1: phone, label2: "Sign", value2: "" },
        ];
        pdf.setFontSize(13);
        pdf.setTextColor(0, 0, 0);

        const startY = 120;
        const lineSpacing = 18;
        const columnWidth = 90;

        let y = startY;

        fields.forEach((field) => {
          const value1Lines = pdf.splitTextToSize(field.value1 || "", columnWidth);
          const value2Lines = pdf.splitTextToSize(field.value2 || "", columnWidth);

          pdf.text(`${field.label1}:`, 20, y);
          pdf.text("_________________________", 50, y);
          value1Lines.forEach((line, index) => {
            pdf.text(line, 55, y - 1.5, index * 6);
          });

          if (field.label2) {
            pdf.text(`${field.label2}:`, 120, y);
            pdf.text("__________________", 150, y);
            value2Lines.forEach((line, index) => {
              pdf.text(line, 155, y - 1.5, index * 6);
            });
          }

          const maxLines = Math.max(value1Lines.length, value2Lines.length);
          y += lineSpacing + (maxLines - 1) * 6;
        });

        const footerImg = new Image();
        footerImg.onload = function () {
          pdf.addImage(footerImg.src, "PNG", 0, 210, 210, 40);

          const pdfBlob = pdf.output("blob");
          const pdfURL = URL.createObjectURL(pdfBlob);
          const downloadLink = document.createElement("a");
          downloadLink.href = pdfURL;
          downloadLink.download = "RegistrationForm.pdf";
          downloadLink.click();
        };

        footerImg.src = footerImage;
      };

      logo.src = logoImage;
    };

    bg.src = bgImage;
  });
}



// async function generateStylishPDF() {
//   const { jsPDF } = window.jspdf;
//   const pdfHeight = 200; // Set custom height for the PDF
//   const pdf = new jsPDF({
//     unit: 'mm',
//     format: [210, pdfHeight], // Custom width (210mm) and height (200mm)
//   });

//   // Collect form data
//   const name = document.getElementById('name').value;
//   const fatherName = document.getElementById('fatherName').value;
//   const course = document.getElementById('course').value;
//   const phone = document.getElementById('phone').value;

//   // Profile picture upload
//   const profilePic = document.getElementById('profilePic').files[0];
//   const logoImage = 'auj-re.png'; // Replace this with the path to your logo image
//   const bgImage = 'bag.jpg'; // Replace this with the path to your background image
//   const footerImage = 'endd.png'; // Replace this with the path to your footer image

//   if (!profilePic) {
//     alert('Please upload a profile picture.');
//     return;
//   }

//   const reader = new FileReader();
//   reader.onload = function (e) {
//     const imgData = e.target.result;

//     // Create a canvas to crop the image into a circle
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     const size = 200; // Define the size of the canvas and image
//     canvas.width = size;
//     canvas.height = size;

//     // Draw a circular clipping path
//     ctx.beginPath();
//     ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
//     ctx.closePath();
//     ctx.clip();

//     // Draw the image inside the circle
//     const image = new Image();
//     image.onload = function () {
//       ctx.drawImage(image, 0, 0, size, size);

//       // Convert the canvas to a base64 image
//       const circularImgData = canvas.toDataURL('image/png');

//       // Add the background image
//       const bg = new Image();
//       bg.onload = function () {
//         const bgWidth = 210; // Full width of the PDF
//         const bgHeight = 70; // Height of the header section
//         pdf.addImage(bg.src, 'JPEG', 0, 0, bgWidth, bgHeight); // Add background image

//         // Add the logo image to the PDF
//         const logo = new Image();
//         logo.onload = function () {
//           const logoX = 10; // X position for the logo
//           const logoY = 35; // Y position for the logo
//           const logoWidth = 65; // Width of the logo (adjust as needed)
//           const logoHeight = 40; // Height of the logo (adjust as needed)

//           // Add the logo to the PDF
//           pdf.addImage(logo.src, 'PNG', logoX, logoY, logoWidth, logoHeight);

//           // Add the circular profile picture
//           const centerX = 85; // X position of the profile picture in the PDF
//           const centerY = 40; // Y position of the profile picture in the PDF
//           pdf.addImage(circularImgData, 'PNG', centerX, centerY, 55, 55);

//           // Add the details below the picture
//           pdf.setFontSize(14);
//           pdf.setTextColor(33, 150, 243); // Blue Text for details
//           pdf.text('Name: ' + name, 20, 100);
//           pdf.text('Father: ' + fatherName, 20, 110);
//           pdf.text('Course: ' + course, 20, 120);
//           pdf.text('Number: ' + phone, 20, 130);

//           // Add footer image
//           const footerImg = new Image();
//           footerImg.onload = function () {
//             const footerX = 0; // X position of the footer image
//             const footerY = 140; // Y position of the footer image
//             const footerWidth = 220; // Width of the footer image
//             const footerHeight = 80; // Height of the footer image
//             pdf.addImage(footerImg.src, 'PNG', footerX, footerY, footerWidth, footerHeight);

//             // Save or open the PDF in a new tab
//             const pdfBlob = pdf.output('blob');
//             const pdfURL = URL.createObjectURL(pdfBlob);
//             const newWindow = window.open();
//             newWindow.document.write(
//               `<iframe src="${pdfURL}" width="100%" height="100%" style="border:none;"></iframe>`
//             );
//           };

//           // Set the footer image source
//           footerImg.src = footerImage;
//         };

//         // Set the logo source
//         logo.src = logoImage;
//       };

//       // Set the background image source
//       bg.src = bgImage;
//     };

//     image.src = imgData;
//   };

//   reader.readAsDataURL(profilePic);
// }
